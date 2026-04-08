import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";

admin.initializeApp();

const db = admin.firestore();

const CATEGORIES = [
  "Casa e Eletro",
  "Papelaria e Gráfica",
  "Saúde e Bem-estar",
  "Móveis e Decoração",
  "Construção e Reforma"
];

/**
 * Auxiliar para enviar mensagem via Meta Cloud API
 */
async function sendWhatsApp(to: string, body: string, phoneId: string, token: string) {
  const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: body },
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      console.error(`Erro ao enviar para ${to}:`, result);
    }
    return result;
  } catch (error) {
    console.error(`Falha na rede ao enviar para ${to}:`, error);
  }
}

/**
 * Trigger: Classifica a demanda via I.A (caso pendente) e notifica Admin/Parceiros.
 */
export const onDemandCreated = functions.firestore.onDocumentCreated(
  {
    document: "demands/{demandId}",
    secrets: ["WHATSAPP_TOKEN", "GEMINI_API_KEY"],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    let data = snapshot.data();
    const demandId = event.params.demandId;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    
    let categories = data.matchedCategories || [];

    // 1. Se não houver categorias, roda a I.A aqui (O "Artifício" Blaze)
    if (categories.length === 0 && GEMINI_KEY) {
      console.info(`[myLupa] 🤖 Iniciando classificação I.A para demanda ${demandId}`);
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Classifique a seguinte demanda de compra para as categorias do marketplace myLupa.
Categorias: ${CATEGORIES.join(", ")}.

Demanda: "${data.request}"
Detalhes: "${data.details || "Nenhum"}"

Responda APENAS um array JSON. Exemplo: ["Casa e Eletro"]. Se não souber, use ["Construção e Reforma"].`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        const jsonMatch = responseText.match(/\[.*\]/);
        
        if (jsonMatch) {
          categories = JSON.parse(jsonMatch[0]);
          // Atualiza o Firestore com o resultado da I.A
          await db.collection("demands").doc(demandId).update({
            matchedCategories: categories,
            status: data.status === "analyzing" ? "pending" : data.status
          });
          console.info(`[myLupa] ✅ I.A classificou como: ${categories.join(", ")}`);
        }
      } catch (error) {
        console.error(`[myLupa] ❌ Falha na classificação I.A:`, error);
        // Fallback básico se a I.A falhar totalmente
        categories = ["Construção e Reforma"]; 
      }
    }

    const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN as string;
    const PHONE_ID = process.env.WHATSAPP_PHONE_ID || "PENDENTE";
    const ADMIN_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER || "5585999999999";

    // 2. Notificar Admin
    const adminMsg = `🚀 *Nova Demanda (Processada)!*\n\n` +
      `📝 *O que:* ${data.request}\n` +
      `👤 *Cliente:* ${data.name || "Anônimo"}\n` +
      `🏷️ *Categorias:* ${categories.join(", ")}\n` +
      `🔗 *Painel:* https://pesquisapromo-4fa92.web.app/admin/demands/${demandId}`;
    
    await sendWhatsApp(ADMIN_NUMBER, adminMsg, PHONE_ID, WHATSAPP_TOKEN);

    // 3. Notificar Parceiros da Categoria
    if (categories.length > 0) {
      const partnersSnapshot = await db.collection("partners")
        .where("category", "in", categories)
        .get();

      const partnerPromises = partnersSnapshot.docs.map(doc => {
        const partner = doc.data();
        const partnerWa = partner.contact?.whatsapp;
        
        if (partnerWa) {
          const partnerMsg = `🛒 *Oportunidade de Venda!*\n\n` +
            `Alguém procura por *${partner.category}*.\n` +
            `📝 *Pedido:* ${data.request}\n\n` +
            `Acesse seu painel:\n` +
            `🔗 https://pesquisapromo-4fa92.web.app/parceiro/painel/${partner.slug}`;
          
          return sendWhatsApp(partnerWa, partnerMsg, PHONE_ID, WHATSAPP_TOKEN);
        }
        return Promise.resolve();
      });

      await Promise.all(partnerPromises);
    }
  }
);

