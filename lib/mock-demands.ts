export type DemandStatus = "new" | "responded" | "archived";

export interface Demand {
  id: string;
  request: string;
  details?: string;
  name: string;
  whatsapp: string;
  status: DemandStatus;
  matchedCategories: string[];
  createdAt: Date;
  sourceUrl?: string;
}

/**
 * Mock demands for demonstrating the partner dashboard.
 * Will be replaced by Firestore queries when connected.
 */
const mockDemands: Demand[] = [
  {
    id: "d-001",
    request: "50 sacos de cimento CP2",
    details: "Preciso de entrega em Piloto, obra residencial no bairro Paz. Pode ser CP2 ou CP5 se tiver melhor preço.",
    name: "Marcus",
    whatsapp: "85999991111",
    status: "new",
    matchedCategories: ["Construção e Reforma", "Casa e Eletro"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
  },
  {
    id: "d-002",
    request: "Geladeira frost free 375L",
    details: "Voltagem 220V, preferência por Electrolux ou Consul. Preciso de entrega e instalação.",
    name: "Ana Paula",
    whatsapp: "85988882222",
    status: "new",
    matchedCategories: ["Casa e Eletro", "Móveis e Decoração"],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5h ago
  },
  {
    id: "d-003",
    request: "Kit escolar completo 5º ano",
    details: "Lista da escola já disponível. Preciso de 2 kits iguais.",
    name: "Dona Francisca",
    whatsapp: "85977773333",
    status: "new",
    matchedCategories: ["Papelaria e Gráfica"],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8h ago
  },
  {
    id: "d-004",
    request: "Fogão 5 bocas com forno",
    details: "Pode ser qualquer marca boa, mesa de vidro. Entrega no centro de Piloto.",
    name: "João Marcos",
    whatsapp: "85966664444",
    status: "responded",
    matchedCategories: ["Casa e Eletro"],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "d-005",
    request: "Vitamina C 1g + Zinco — 3 caixas",
    details: "Uso contínuo. Se tiver genérico, melhor.",
    name: "Carla",
    whatsapp: "85955555555",
    status: "responded",
    matchedCategories: ["Saúde e Bem-estar"],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "d-006",
    request: "Orçamento pintura 3 quartos",
    details: "Pintura interna, tinta inclusa, cores claras.",
    name: "Pedro",
    whatsapp: "85944446666",
    status: "archived",
    matchedCategories: ["Construção e Reforma"],
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
  },
];

/**
 * Get demands relevant to a specific partner based on their category.
 */
export function getDemandsForPartner(partnerCategory: string): Demand[] {
  return mockDemands
    .filter((d) => d.matchedCategories.includes(partnerCategory))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Format a WhatsApp number for display: (85) 99999-1111
 */
export function formatWhatsappDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return raw;
}

/**
 * Generate a wa.me link with a pre-formatted message.
 */
export function generateWhatsappLink(
  whatsapp: string,
  customerName: string,
  request: string,
  partnerName: string
): string {
  const msg = encodeURIComponent(
    `Olá ${customerName}! Aqui é a ${partnerName} do myLupa. Sobre sua demanda "${request}" — temos uma proposta pra você! Posso enviar os detalhes?`
  );
  const digits = whatsapp.replace(/\D/g, "");
  const fullNumber = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${fullNumber}?text=${msg}`;
}

/**
 * Format relative time in Portuguese.
 */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "agora mesmo";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "há 1 dia";
  return `há ${days} dias`;
}
