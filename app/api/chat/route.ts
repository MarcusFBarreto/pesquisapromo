import { NextRequest, NextResponse } from "next/server";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `Você é o Promo, assistente virtual e consultor técnico do myLupa. 
Seu papel é ser um especialista camarada (estilo "vizinho que entende de tudo") que ajuda o usuário a refinar o pedido para que os parceiros locais enviem propostas certeiras.

REGRAS DE OURO:
1. **Análise Técnica Imediata**: Assim que receber a demanda, identifique o que é. Se for algo técnico (móveis, construção, peças), diga: "Vi que você precisa de [item]. Normalmente, para isso, os parceiros precisam saber [medidas/cor/voltagem/material/peso]."
2. **Peça Especificações**: Tente coletar detalhes que evitem idas e vindas. Pergunte e ajude a definir.
3. **Explanação de Valor**: Se o pedido for simples ou já estiver completo, compartilhe uma curiosidade curta ou uma dica técnica sobre o produto/serviço para gerar valor (ex: "Sabia que o cimento CP2 é o mais versátil para reformas gerais?").
4. **Equipe de Apoio**: Se o item for muito raro, difícil de achar ou o usuário estiver frustrado, ofereça o "Apoio Especial da nossa Equipe de Busca".
5. **Categorização**: Ao final (esperar ~3 trocas), sugira as categorias ideais: Casa e Eletro, Papelaria e Gráfica, Saúde e Bem-estar, Móveis e Decoração, Construção e Reforma.
6. **Estilo**: Amigável, direto, prestativo e com autoridade técnica leve. Use no máximo 2 perguntas por vez.`;

type ChatMsg = { role: "assistant" | "user"; content: string };

// ─── OpenAI (GPT) ───
async function callOpenAI(messages: ChatMsg[], systemPrompt: string): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({ apiKey: OPENAI_KEY });

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" as const : "user" as const,
        content: m.content,
      })),
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "Desculpe, tive um problema. Tenta novamente?";
}

// ─── Gemini ───
async function callGemini(messages: ChatMsg[], systemPrompt: string): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(GEMINI_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const history = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({
    history: history.slice(0, -1),
    systemInstruction: systemPrompt,
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}

// ─── Main API handler ───
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, demand, partnerName } = body as {
      messages: ChatMsg[];
      demand: string;
      partnerName?: string | null;
    };

    // No keys at all → fallback to client-side mock
    if (!OPENAI_KEY && !GEMINI_KEY) {
      return NextResponse.json({ fallback: true });
    }

    const contextLine = partnerName
      ? `O usuário está na página do parceiro "${partnerName}".`
      : "O usuário está na página geral do myLupa.";
    const demandLine = demand
      ? `O pedido inicial do usuário foi: "${demand}".`
      : "O usuário ainda não descreveu o que precisa.";
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${contextLine}\n${demandLine}`;

    let content: string;
    let provider: string;

    // 1. Try OpenAI (Paid/Stable) first if available
    if (OPENAI_KEY) {
      try {
        content = await callOpenAI(messages, fullPrompt);
        provider = "openai";
        return NextResponse.json({ content, provider });
      } catch (error) {
        console.warn("[myLupa] OpenAI Chat failed, trying Gemini...", error);
      }
    }

    // 2. Try Gemini (Free/Experimental)
    if (GEMINI_KEY) {
      try {
        content = await callGemini(messages, fullPrompt);
        provider = "gemini";
        return NextResponse.json({ content, provider });
      } catch (error) {
        console.error("[myLupa] Gemini Chat failed:", error);
      }
    }

    // No providers worked or available
    return NextResponse.json({ fallback: true });
  } catch (error) {
    console.error("[myLupa] AI API error:", error);
    return NextResponse.json({ fallback: true });
  }
}
