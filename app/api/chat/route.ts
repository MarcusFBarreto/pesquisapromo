import { NextRequest, NextResponse } from "next/server";

const GEMINI_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `Você é o Promo, assistente virtual do PesquisaPromo em Horizonte/CE.
Seu papel é ajudar o usuário a detalhar melhor seu pedido para que os parceiros locais possam responder com propostas mais certeiras.

Regras:
- Faça perguntas curtas e diretas, no máximo 2 por vez
- Seja simpático, informal e objetivo — fale como um vizinho que entende do assunto
- Nunca invente preços ou produtos
- Quando sentir que já tem informação suficiente (após ~3 trocas), diga que os detalhes estão prontos e estimule o envio
- Se o usuário não soube o que é algo (ex: "CP2"), explique brevemente
- Categorias de parceiros disponíveis: Casa e Eletro, Papelaria e Gráfica, Saúde e Bem-estar, Móveis e Decoração, Construção e Reforma
- Ao final, sugira qual(is) categoria(s) de parceiro melhor atendem à demanda`;

type ChatMsg = { role: "assistant" | "user"; content: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, demand, partnerName } = body as {
      messages: ChatMsg[];
      demand: string;
      partnerName?: string | null;
    };

    // If no API key, return a flag so the client falls back to mock
    if (!GEMINI_KEY) {
      return NextResponse.json({ fallback: true }, { status: 200 });
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build conversation context
    const contextLine = partnerName
      ? `O usuário está na página do parceiro "${partnerName}".`
      : "O usuário está na página geral do PesquisaPromo.";
    const demandLine = demand
      ? `O pedido inicial do usuário foi: "${demand}".`
      : "O usuário ainda não descreveu o que precisa.";

    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n${contextLine}\n${demandLine}`;

    // Convert to Gemini format
    const history = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: history.slice(0, -1), // all but last message
      systemInstruction: fullSystemPrompt,
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("[PesquisaPromo] Gemini API error:", error);
    return NextResponse.json({ fallback: true }, { status: 200 });
  }
}
