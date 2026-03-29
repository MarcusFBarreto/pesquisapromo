export type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  source?: "gemini" | "mock";
};

type ChatContext = {
  demand: string;
  partnerName?: string | null;
};

// ─── Initial message (always local, no API needed) ───

export function getInitialMessage(context: ChatContext): ChatMessage {
  const partnerRef = context.partnerName
    ? `, e vi que você está de olho no **${context.partnerName}**`
    : "";

  if (!context.demand.trim()) {
    return {
      role: "assistant",
      content: `Olá! 👋 Sou o **Promo**, assistente do PesquisaPromo${partnerRef}. Me conta o que você tá precisando que eu te ajudo a montar um pedido bem descrito pra você receber as melhores propostas!`,
    };
  }

  return {
    role: "assistant",
    content: `Olá! 👋 Sou o **Promo**, assistente do PesquisaPromo${partnerRef}. Vi que você precisa de **"${context.demand}"**. Posso te fazer umas perguntinhas rápidas pra deixar seu pedido mais completo e você receber propostas melhores. Topa?`,
  };
}

// ─── Main response: tries Gemini API first, falls back to mock ───

export async function getAssistantResponse(
  messages: ChatMessage[],
  context: ChatContext
): Promise<ChatMessage> {
  // Try the real AI first
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        demand: context.demand,
        partnerName: context.partnerName,
      }),
    });

    const data = await res.json();

    // If the API returned a real response (not fallback), use it
    if (!data.fallback && data.content) {
      return { role: "assistant", content: data.content, source: "gemini" };
    }
  } catch {
    // Network error — fall through to mock
  }

  // ─── Mock fallback ───
  return getMockResponse(messages, context);
}

// ─── Mock response engine (keyword-based) ───

const QUESTION_PATTERNS: Array<{
  keywords: string[];
  questions: string[];
}> = [
  {
    keywords: ["cimento", "areia", "cal", "argamassa", "tijolo", "bloco"],
    questions: [
      "Quantos sacos/metros você precisa exatamente?",
      "É pra obra residencial ou comercial?",
      "Precisa de entrega no local da obra?",
    ],
  },
  {
    keywords: ["geladeira", "fogão", "lavadora", "máquina", "eletro", "micro-ondas"],
    questions: [
      "Tem preferência por alguma marca ou modelo?",
      "Qual a voltagem da sua casa — 110V ou 220V?",
      "Precisa de entrega e instalação?",
    ],
  },
  {
    keywords: ["móvel", "sofá", "cama", "colchão", "mesa", "cadeira", "armário"],
    questions: [
      "Tem as medidas do espaço onde vai colocar?",
      "Prefere algo planejado ou pronto?",
      "Precisa de montagem no local?",
    ],
  },
  {
    keywords: ["remédio", "medicamento", "vitamina", "farmácia", "fralda"],
    questions: [
      "Tem receita médica? Alguns itens precisam.",
      "É uso contínuo ou pontual?",
      "Quer que a gente verifique genéricos mais em conta?",
    ],
  },
  {
    keywords: ["escolar", "caderno", "lápis", "mochila", "kit"],
    questions: [
      "É pra qual ano/série?",
      "Tem a lista da escola? Assim o parceiro já monta o kit completo.",
      "Quantos kits precisa?",
    ],
  },
  {
    keywords: ["pintura", "tinta", "pintor", "pintar"],
    questions: [
      "Quantos cômodos/m² precisa pintar?",
      "Já tem a tinta ou precisa incluir no orçamento?",
      "É pintura interna, externa ou as duas?",
    ],
  },
  {
    keywords: ["ar-condicionado", "ar condicionado", "climatização"],
    questions: [
      "Qual o tamanho do ambiente (m²)?",
      "É instalação nova ou manutenção/conserto?",
      "Tem preferência de marca ou BTU?",
    ],
  },
];

const GENERIC_QUESTIONS = [
  "Pode me dar mais detalhes sobre o que precisa?",
  "É pra uso pessoal, de empresa ou pra presente?",
  "Tem urgência ou pode esperar uns dias?",
  "Precisa de entrega ou vai buscar?",
];

let questionIndex = 0;

async function getMockResponse(
  messages: ChatMessage[],
  context: ChatContext
): Promise<ChatMessage> {
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

  const lastUserMessage =
    messages.filter((m) => m.role === "user").pop()?.content.toLowerCase() || "";
  const allText = (context.demand + " " + lastUserMessage).toLowerCase();

  // Quick replies to initial question
  if (messages.length <= 3 && /^(sim|topa|pode|claro|bora|vamos|ok|s)$/i.test(lastUserMessage.trim())) {
    const matched = QUESTION_PATTERNS.find((p) => p.keywords.some((kw) => allText.includes(kw)));
    return { role: "assistant", content: `Boa! ${matched ? matched.questions[0] : GENERIC_QUESTIONS[0]}`, source: "mock" };
  }

  if (messages.length <= 3 && /^(não|nao|n|enviar|pular)$/i.test(lastUserMessage.trim())) {
    return {
      role: "assistant",
      content: "Sem problemas! 👍 Seu pedido já está bom. Preenche o WhatsApp ali do lado e clica em **Enviar** quando quiser.",
      source: "mock",
    };
  }

  const matched = QUESTION_PATTERNS.find((p) => p.keywords.some((kw) => allText.includes(kw)));
  const userMessageCount = messages.filter((m) => m.role === "user").length;

  if (userMessageCount >= 3) {
    return {
      role: "assistant",
      content: `Perfeito, acho que já entendi bem o que você precisa! 🎯 Pode conferir o resumo ali do lado e enviar quando quiser.`,
      source: "mock",
    };
  }

  if (matched) {
    questionIndex = (questionIndex + 1) % matched.questions.length;
    return { role: "assistant", content: `Anotado! E mais uma coisa: ${matched.questions[questionIndex]}`, source: "mock" };
  }

  questionIndex = (questionIndex + 1) % GENERIC_QUESTIONS.length;
  return { role: "assistant", content: `Entendi! ${GENERIC_QUESTIONS[questionIndex]}`, source: "mock" };
}
