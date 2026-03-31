import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

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
 * Trigger: Notifica Admin e Parceiros sobre nova demanda.
 */
export const onDemandCreated = functions.firestore.onDocumentCreated(
  {
    document: "demands/{demandId}",
    secrets: ["WHATSAPP_TOKEN"],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const data = snapshot.data();
    const demandId = event.params.demandId;
    const categories = data.matchedCategories || [];
    
    const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN as string;
    const PHONE_ID = process.env.WHATSAPP_PHONE_ID || "PENDENTE";
    const ADMIN_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER || "5585999999999";

    console.info(`Processando notificações para demanda ${demandId}`);

    // 1. Notificar Admin (Resumo completo)
    const adminMsg = `🚀 *Nova Demanda!*\n\n` +
      `📝 *O que:* ${data.request}\n` +
      `👤 *Cliente:* ${data.name || "Anônimo"}\n` +
      `🏷️ *Categorias:* ${categories.join(", ")}\n` +
      `🔗 *Painel:* https://pesquisapromo-4fa92.web.app/admin/demands/${demandId}`;
    
    await sendWhatsApp(ADMIN_NUMBER, adminMsg, PHONE_ID, WHATSAPP_TOKEN);

    // 2. Notificar Parceiros da Categoria
    if (categories.length > 0) {
      const partnersSnapshot = await db.collection("partners")
        .where("category", "in", categories)
        .get();

      const partnerPromises = partnersSnapshot.docs.map(doc => {
        const partner = doc.data();
        const partnerWa = partner.contact?.whatsapp;
        
        if (partnerWa) {
          const partnerMsg = `🛒 *Oportunidade de Venda em Horizonte!*\n\n` +
            `Alguém está procurando por produtos de *${partner.category}*.\n` +
            `📝 *Pedido:* ${data.request}\n\n` +
            `Acesse seu painel para enviar uma proposta:\n` +
            `🔗 https://pesquisapromo-4fa92.web.app/parceiro/painel/${partner.slug}`;
          
          return sendWhatsApp(partnerWa, partnerMsg, PHONE_ID, WHATSAPP_TOKEN);
        }
        return Promise.resolve();
      });

      await Promise.all(partnerPromises);
      console.info(`Notificações enviadas para ${partnersSnapshot.size} parceiros.`);
    }
  }
);
