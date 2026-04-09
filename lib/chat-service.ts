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
      content: `Olá! 👋 Sou o **Promo**, seu consultor técnico aqui no myLupa${partnerRef}. Como posso ajudar com as especificações técnicas do seu pedido hoje?`,
    };
  }

  return {
    role: "assistant",
    content: `Olá! 👋 Sou o **Promo**, seu consultor técnico${partnerRef}. Deixa eu analisar seu pedido de **"${context.demand}"** para garantir que os parceiros recebam todos os detalhes necessários...`,
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
export async function getMockResponse(messages: Message[], context: any): Promise<Message> {
  // ─── Expert Mock Fallback ───
  const lastUserMessage =
    messages.filter((m) => m.role === "user").pop()?.content.toLowerCase() || "";
  const allText = (context.demand + " " + lastUserMessage).toLowerCase();

  const isZincTile = allText.includes("telha") && allText.includes("zinco");
  const isMasonry = ["tijolo", "bloco", "cerâmica"].some(kw => allText.includes(kw));

  // Technical tips based on category
  const getTechnicalTip = (text: string) => {
    if (text.includes("telha")) return "Dica: Telhas de 0.50mm duram muito mais que as de 0.43mm!";
    if (text.includes("cimento")) return "Dica: O CP2 é ótimo, mas para secagem rápida use CP5.";
    if (text.includes("geladeira")) return "Dica: Modelos Inverter economizam até 40% de energia.";
    return "Dica: Detalhes técnicos ajudam o lojista a te dar o melhor preço!";
  };

  const tip = getTechnicalTip(allText);

  // Specific logic for Zinc Tiles
  if (isZincTile && !allText.includes("espessura") && !allText.includes("modelo")) {
    return {
      role: "assistant",
      content: `Entendi! Para **Telhas de Zinco**, você sabe me dizer a **espessura** (0.43 ou 0.50)? E o **formato** (Trapezoidal ou Ondulada)?\n\n_${tip}_`,
      source: "mock"
    };
  }

  const userMessageCount = messages.filter((m) => m.role === "user").length;

  if (userMessageCount >= 4) {
    return {
      role: "assistant",
      content: "Excelente conjunto de informações! 🎯 Já incluí esses detalhes técnicos no seu pedido. Você pode conferir tudo no resumo e clicar em **Enviar** quando quiser.",
      source: "mock",
    };
  }

  const matched = QUESTION_PATTERNS.find((p) => p.keywords.some((kw) => allText.includes(kw)));
  const nextQuestion = matched ? matched.questions[userMessageCount % matched.questions.length] : GENERIC_QUESTIONS[userMessageCount % GENERIC_QUESTIONS.length];

  return {
    role: "assistant",
    content: `${nextQuestion}\n\n_${tip}_`,
    source: "mock"
  };
}
