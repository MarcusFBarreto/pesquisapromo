import { getAllPartners, Partner } from "./partner-data";

/**
 * All known partner categories in PesquisaPromo.
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
 * Returns all matching categories, sorted by relevance (most keyword hits first).
 */
export function classifyDemand(request: string, details?: string): string[] {
  const text = `${request} ${details || ""}`.toLowerCase();

  const scores: { category: string; hits: number }[] = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const hits = keywords.filter((kw) => text.includes(kw)).length;
    if (hits > 0) {
      scores.push({ category, hits });
    }
  }

  // Sort by number of keyword hits (most relevant first)
  scores.sort((a, b) => b.hits - a.hits);

  // If no match, return all categories (broadcast)
  if (scores.length === 0) {
    return Object.keys(CATEGORY_KEYWORDS);
  }

  return scores.map((s) => s.category);
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
export function routeDemand(
  request: string,
  details?: string,
  excludeSlugs: string[] = []
): { categories: string[]; partners: Partner[] } {
  const categories = classifyDemand(request, details);
  const partners = getTargetPartners(categories).filter(
    (p) => !excludeSlugs.includes(p.slug)
  );

  return { categories, partners };
}
