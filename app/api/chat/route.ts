import { NextRequest, NextResponse } from "next/server";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `Você é o Promo, assistente virtual do PesquisaPromo em Horizonte/CE.
Seu papel é ajudar o usuário a detalhar melhor seu pedido para que os parceiros locais possam responder com propostas mais certeiras.

Regras:
- Faça perguntas curtas e diretas, no máximo 2 por vez, sendo simpático estilo "vizinho que entende do assunto".
- Nunca invente preços ou produtos.
- IMPORTANTE: Em algum momento, sempre pergunte qual o PRAZO esperado ou urgência para receber os orçamentos/produtos.
- COMPRADORES TERCEIRIZADOS (REGRA DE OURO): Se o usuário disser que procurou muito algo e não achou, ou pedir um item muito raro/difícil, informe que o PesquisaPromo vai abrir um chamado especial. Diga que temos uma equipe de "Compradores Terceirizados" especializados em caçar coisas difíceis para ele no mercado.
- Quando sentir que já tem informação suficiente (após ~3 trocas), diga que os detalhes estão prontos e estimule o clique no botão Enviar.
- Categorias disponíveis: Casa e Eletro, Papelaria e Gráfica, Saúde e Bem-estar, Móveis e Decoração, Construção e Reforma.
- Ao final, sugira qual(is) categoria(s) melhor atendem à demanda.`;

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
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

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
      : "O usuário está na página geral do PesquisaPromo.";
    const demandLine = demand
      ? `O pedido inicial do usuário foi: "${demand}".`
      : "O usuário ainda não descreveu o que precisa.";
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${contextLine}\n${demandLine}`;

    let content: string;
    let provider: string;

    // Priority: OpenAI (paid) > Gemini (free tier)
    if (OPENAI_KEY) {
      content = await callOpenAI(messages, fullPrompt);
      provider = "openai";
    } else {
      content = await callGemini(messages, fullPrompt);
      provider = "gemini";
    }

    return NextResponse.json({ content, provider });
  } catch (error) {
    console.error("[PesquisaPromo] AI API error:", error);
    return NextResponse.json({ fallback: true });
  }
}
