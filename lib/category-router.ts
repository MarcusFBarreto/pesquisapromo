import { getAllPartners } from "./partner-data";
import { Partner } from "./types";

/**
 * All known partner categories in myLupa.
 * Used for classification matching.
 */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Casa e Eletro": [
    "geladeira", "fogão", "lavadora", "micro-ondas", "air fryer",
    "eletrodoméstico", "eletro", "cooktop", "televisão", "tv",
    "ventilador", "liquidificador", "ferro", "aspirador",
  ],
  "Papelaria e Gráfica": [
    "caderno", "lápis", "caneta", "mochila", "escolar", "kit escolar",
    "impressão", "cópia", "encadernação", "papelaria", "adesivo",
    "cartão de visita", "banner", "gráfica",
  ],
  "Saúde e Bem-estar": [
    "remédio", "medicamento", "vitamina", "fralda", "farmácia",
    "higiene", "perfumaria", "suplemento", "protetor", "curativo",
    "pressão", "glicemia", "saúde",
  ],
  "Móveis e Decoração": [
    "móvel", "sofá", "cama", "colchão", "mesa", "cadeira", "armário",
    "estante", "rack", "guarda-roupa", "cômoda", "decoração",
    "planejado", "cortina", "tapete",
  ],
  "Construção e Reforma": [
    "cimento", "areia", "cal", "argamassa", "tijolo", "bloco",
    "tinta", "pintura", "ferragem", "ferramenta", "hidráulico",
    "elétrico", "telha", "madeira", "piso", "cerâmica", "obra",
    "reforma", "construção", "pedreiro", "isopor", "laje", "eps",
  ],
};

/**
 * Classify a demand into matching categories using keyword analysis.
 * (Legacy/Fallback logic)
 */
export function classifyDemandKeywords(request: string, details?: string): string[] {
  const text = `${request} ${details || ""}`.toLowerCase();
  const scores: { category: string; hits: number }[] = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const hits = keywords.filter((kw) => text.includes(kw)).length;
    if (hits > 0) {
      scores.push({ category, hits });
    }
  }
  scores.sort((a, b) => b.hits - a.hits);
  if (scores.length === 0) return Object.keys(CATEGORY_KEYWORDS);
  return scores.map((s) => s.category);
}

/**
 * Classify a demand using AI (Gemini or OpenAI) for semantic understanding.
 * Returns matching categories in order of relevance.
 */
export async function classifyDemand(request: string, details?: string): Promise<string[]> {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  
  const categoriesList = Object.keys(CATEGORY_KEYWORDS).join(", ");
  const prompt = `Classifique a seguinte demanda de compra de um usuário para as categorias do marketplace myLupa.
Categorias disponíveis: ${categoriesList}.

Demanda: "${request}"
Detalhes adicionais: "${details || "Nenhum"}"

Regra: Responda APENAS um array JSON com as categorias que combinam, em ordem de relevância. Exemplo: ["Casa e Eletro", "Construção e Reforma"]. Se não souber, retorne ["Construção e Reforma"] como padrão.`;

  // 1. Try Gemini (Flash)
  if (GEMINI_KEY) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(GEMINI_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const jsonMatch = responseText.match(/\[.*\]/);
      if (jsonMatch) {
        const categories = JSON.parse(jsonMatch[0]);
        if (Array.isArray(categories) && categories.length > 0) return categories;
      }
    } catch (error) {
      console.warn("[myLupa] ⚠️ Gemini Categorization failed, trying OpenAI...", error);
    }
  }

  // 2. Try OpenAI (GPT-4o-mini)
  if (OPENAI_KEY) {
    try {
      const OpenAI = (await import("openai")).default;
      const client = new OpenAI({ apiKey: OPENAI_KEY });
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      });
      const responseText = response.choices[0]?.message?.content || "";
      const jsonMatch = responseText.match(/\[.*\]/);
      if (jsonMatch) {
        const categories = JSON.parse(jsonMatch[0]);
        if (Array.isArray(categories) && categories.length > 0) return categories;
      }
    } catch (error) {
      console.warn("[myLupa] ⚠️ OpenAI Categorization failed, using keywords...", error);
    }
  }

  // 3. Fallback to keywords
  return classifyDemandKeywords(request, details);
}

/**
 * Get partners that match the given categories.
 * Partners are matched if their category is in the list.
 */
export function getTargetPartners(categories: string[]): Partner[] {
  return getAllPartners().filter((p) =>
    categories.includes(p.category)
  );
}

/**
 * Full pipeline: classify a demand and find matching partners.
 */
export async function routeDemand(
  request: string,
  details?: string,
  excludeSlugs: string[] = []
): Promise<{ categories: string[]; partners: Partner[] }> {
  const categories = await classifyDemand(request, details);
  const partners = getTargetPartners(categories).filter(
    (p) => !excludeSlugs.includes(p.slug)
  );

  return { categories, partners };
}
