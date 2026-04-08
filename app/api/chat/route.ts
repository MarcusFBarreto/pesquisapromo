import { NextRequest, NextResponse } from "next/server";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `Você é o PROMO, o Consultor Técnico Sênior do myLupa. Sua função NÃO é apenas conversar, mas atuar como um engenheiro/especialista que ajuda o usuário a montar um memorial descritivo perfeito para que os fornecedores não tenham dúvidas no preço.

PERSONALIDADE:
- Especialista experiente, prático e atencioso.
- Estilo "Vizinho Mestre de Obras" que conhece cada detalhe técnico.

REGRAS DE OURO:
1. **Interrogatório Técnico Proativo**: Assim que identificar o item (ex: Telha, Sofá, Remédio), você DEVE listar especificações críticas. 
   - Ex (Telha): Pergunte sobre espessura (0.43? 0.50?), modelo (Trapezoidal? Ondulada?), revestimento (Galvalume?) e se precisa de acessórios (parafusos, vedações).
   - Ex (Móveis): Peça medidas exatas, tipo de tecido/material e se há restrição de acesso para entrega.
2. **Evite Genericismos**: Nunca diga apenas "entendi". Diga: "Isso é importante. Mas para o lojista te dar o melhor preço, precisamos definir [X] e [Y]".
3. **Geração de Valor**: A cada resposta, dê uma dica técnica curta que poupe dinheiro ou dor de cabeça ao usuário (ex: "Telhas de 0.50mm são 20% mais resistentes a granizo que as de 0.43mm").
4. **Resumo de Progresso**: Se o usuário responder algo técnico, confirme: "Excelente, já anotei que a espessura é [X]. Isso ajuda muito!"
5. **Conclusão de Análise**: Apenas quando tiver pelo menos 3-4 detalhes técnicos sólidos, diga que o pedido está pronto para ser enviado com "Selo de Qualidade Promo".

IMPORTANTE: Se o usuário te desafiar ou perguntar "você não quer saber de X?", responda como um expert: "Com certeza! Estava justamente chegando nesse ponto. Para [Item], a [Especificação] é fundamental porque..."`;


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
