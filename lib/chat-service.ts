export type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  source?: "openai" | "gemini" | "mock";
};

type ChatContext = {
  demand: string;
  partnerName?: string | null;
};

// ─── Initial message (always local, no API needed) ───

export function getInitialMessage(context: ChatContext): ChatMessage {
  const partnerRef = context.partnerName
    ? `, e vi que você está interessado no **${context.partnerName}**`
    : "";

  if (!context.demand.trim()) {
    return {
      role: "assistant",
      content: `Olá! 👋 Sou o **Promo**, seu consultor técnico aqui no myLupa${partnerRef}. Me conta o que você está procurando!`,
    };
  }

  return {
    role: "assistant",
    content: `Olá! 👋 Sou o **Promo**, seu consultor técnico${partnerRef}. Deixa eu dar uma olhada rápida no seu pedido de **"${context.demand}"**...`,
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
      return { role: "assistant", content: data.content, source: (data.provider || "gemini") as "openai" | "gemini" };
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
  "Qual o seu prazo ideal para receber os orçamentos ou o produto em si?",
  "Pode me dar mais detalhes sobre a quantidade ou Especificação técnica?",
  "É pra uso pessoal, de empresa ou pra presente?",
  "Precisa de entrega ou vai buscar?",
];

let questionIndex = 0;

async function getMockResponse(
  messages: ChatMessage[],
  context: ChatContext
): Promise<ChatMessage> {
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

  const lastUserMessage =
    messages.filter((m) => m.role === "user").pop()?.content.toLowerCase() || "";
  const allText = (context.demand + " " + lastUserMessage).toLowerCase();

  // Natural prefixes to avoid repetition
  const prefixes = [
    "Legal! E",
    "Entendi. Outra coisa:",
    "Certo! Pra fechar o pedido,",
    "Ótimo. E quanto a isso:",
    "Uma dúvida importante:",
  ];
  const prefix = prefixes[messages.length % prefixes.length];

  // Specific logic for bricks/blocks (avoid "sacos/metros")
  const isMasonry = ["tijolo", "bloco", "cerâmica", "telha"].some(kw => allText.includes(kw));

  // Quick replies to initial question
  if (messages.length <= 3 && /^(sim|topa|pode|claro|bora|vamos|ok|s)$/i.test(lastUserMessage.trim())) {
    const matched = QUESTION_PATTERNS.find((p) => p.keywords.some((kw) => allText.includes(kw)));
    let initialQuestion = matched ? matched.questions[0] : GENERIC_QUESTIONS[0];
    
    // Adjust first question if it's masonry
    if (isMasonry && initialQuestion.includes("sacos/metros")) {
      initialQuestion = "De quantos milheiros ou unidades você precisa exatamente?";
    }

    return { role: "assistant", content: `Boa! ${initialQuestion}`, source: "mock" };
  }

  if (messages.length <= 3 && /^(não|nao|n|enviar|pular)$/i.test(lastUserMessage.trim())) {
    return {
      role: "assistant",
      content: "Sem problemas! 👍 Seu pedido já está bem encaminhado. Quando estiver pronto, basta preencher seu WhatsApp e clicar em **Enviar**.",
      source: "mock",
    };
  }

  const matched = QUESTION_PATTERNS.find((p) => p.keywords.some((kw) => allText.includes(kw)));
  const userMessageCount = messages.filter((m) => m.role === "user").length;

  if (userMessageCount >= 3) {
    return {
      role: "assistant",
      content: `Perfeito, já consegui mapear tudo o que os parceiros precisam! 🎯 Pode conferir o resumo ali do lado e clicar em enviar quando quiser.`,
      source: "mock",
    };
  }

  if (matched) {
    questionIndex = (questionIndex + 1) % matched.questions.length;
    let nextQuestion = matched.questions[questionIndex];
    
    // Safety check for masonry in any step
    if (isMasonry && nextQuestion.includes("sacos/metros")) {
      nextQuestion = "Qual a quantidade exata em milheiros ou unidades?";
    }

    return { role: "assistant", content: `${prefix} ${nextQuestion}`, source: "mock" };
  }

  questionIndex = (questionIndex + 1) % GENERIC_QUESTIONS.length;
  return { role: "assistant", content: `${prefix} ${GENERIC_QUESTIONS[questionIndex]}`, source: "mock" };
}
