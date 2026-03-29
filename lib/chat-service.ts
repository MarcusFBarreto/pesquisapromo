export type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type ChatContext = {
  demand: string;
  partnerName?: string | null;
};

/**
 * Mock chat service for the "Promo" AI assistant.
 * 
 * In production, replace `getMockResponse` with a call to
 * Gemini or OpenAI using the same system prompt structure.
 */

const SYSTEM_CONTEXT = `Você é o Promo, assistente virtual do PesquisaPromo em Horizonte/CE.
Seu papel é ajudar o usuário a detalhar melhor seu pedido para que os parceiros locais possam responder com propostas mais certeiras.
Faça perguntas curtas e diretas, no máximo 2 por vez.
Seja simpático, informal e objetivo.
Nunca invente preços ou produtos. Apenas ajude a esclarecer o pedido.`;

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

// Keyword-based mock responses — will be replaced by real AI
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
  "É pra uso pessoal, de empresia ou pra presente?",
  "Tem urgência ou pode esperar uns dias?",
  "Precisa de entrega ou vai buscar?",
];

let questionIndex = 0;

export async function getAssistantResponse(
  messages: ChatMessage[],
  context: ChatContext
): Promise<ChatMessage> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

  const lastUserMessage = messages
    .filter((m) => m.role === "user")
    .pop()?.content.toLowerCase() || "";

  const allText = (context.demand + " " + lastUserMessage).toLowerCase();

  // Check if user said "sim" / "topa" / "pode" to initial question
  if (
    messages.length <= 3 &&
    /^(sim|topa|pode|claro|bora|vamos|ok|s)$/i.test(lastUserMessage.trim())
  ) {
    // Find relevant questions
    const matched = QUESTION_PATTERNS.find((p) =>
      p.keywords.some((kw) => allText.includes(kw))
    );

    if (matched) {
      const q = matched.questions[0];
      return { role: "assistant", content: `Boa! ${q}` };
    }

    return {
      role: "assistant",
      content: `Boa! ${GENERIC_QUESTIONS[0]}`,
    };
  }

  // Check if user said "não" — skip chat, let them submit
  if (
    messages.length <= 3 &&
    /^(não|nao|n|enviar|pular)$/i.test(lastUserMessage.trim())
  ) {
    return {
      role: "assistant",
      content:
        "Sem problemas! 👍 Seu pedido já está bom. Preenche o WhatsApp ali do lado e clica em **Enviar** quando quiser.",
    };
  }

  // For subsequent messages — pick next relevant question
  const matched = QUESTION_PATTERNS.find((p) =>
    p.keywords.some((kw) => allText.includes(kw))
  );

  if (matched) {
    questionIndex = (questionIndex + 1) % matched.questions.length;
    const q = matched.questions[questionIndex];

    // After 2+ questions, suggest they're ready
    if (messages.filter((m) => m.role === "user").length >= 3) {
      return {
        role: "assistant",
        content: `Entendi! Acho que já temos bastante informação. 🎯 Dá uma olhada no campo de detalhes ali do lado — eu sugiro adicionar isso: **"${lastUserMessage}"**. Quando estiver pronto, é só enviar!`,
      };
    }

    return {
      role: "assistant",
      content: `Anotado! E mais uma coisa: ${q}`,
    };
  }

  // Generic fallback
  questionIndex = (questionIndex + 1) % GENERIC_QUESTIONS.length;
  
  if (messages.filter((m) => m.role === "user").length >= 3) {
    return {
      role: "assistant",
      content: `Perfeito, acho que já entendi bem o que você precisa! 🎯 Pode conferir o resumo ali do lado e enviar quando quiser. Os parceiros vão receber tudo certinho.`,
    };
  }

  return {
    role: "assistant",
    content: `Entendi! ${GENERIC_QUESTIONS[questionIndex]}`,
  };
}
