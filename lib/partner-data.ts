export interface Partner {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  city: string;
  region: string;
  description: string;
  services: string[];
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  featured: boolean;
}

export const partners: Partner[] = [
  {
    slug: "j-erivaldo-cia",
    name: "J Erivaldo & Cia",
    tagline: "Eletrodomésticos e utilidades para o lar",
    category: "Casa e Eletro",
    city: "Horizonte",
    region: "CE",
    description:
      "Loja referência no eixo da Castelo Branco em Horizonte. Trabalha com geladeiras, fogões, lavadoras e utilidades domésticas com preço de cidade pequena e atendimento de vizinho.",
    services: [
      "Geladeiras e refrigeradores",
      "Fogões e cooktops",
      "Lavadoras e tanquinhos",
      "Micro-ondas e air fryers",
      "Móveis para cozinha e sala",
    ],
    contact: {
      phone: "(85) 3336-1234",
      whatsapp: "5585933361234",
    },
    featured: true,
  },
  {
    slug: "art-ton-papelaria",
    name: "Art & Ton Papelaria",
    tagline: "Material escolar, escritório e gráfica rápida",
    category: "Papelaria e Gráfica",
    city: "Horizonte",
    region: "CE",
    description:
      "Papelaria completa no centro de Horizonte. Atende escolas, escritórios e quem precisa de impressão, encadernação ou material de última hora.",
    services: [
      "Kits escolares completos",
      "Material de escritório",
      "Impressão e cópias",
      "Encadernação e plastificação",
      "Presentes e lembrancinhas",
    ],
    contact: {
      phone: "(85) 3336-5678",
      whatsapp: "5585933365678",
    },
    featured: true,
  },
  {
    slug: "farmacia-caminho-popular",
    name: "Farmácia Caminho Popular",
    tagline: "Medicamentos, perfumaria e atendimento próximo",
    category: "Saúde e Bem-estar",
    city: "Horizonte",
    region: "CE",
    description:
      "Farmácia de bairro com preço acessível. Localizada na Castelo Branco, atende com conveniência e proximidade quem precisa de medicamentos, higiene e perfumaria.",
    services: [
      "Medicamentos com e sem receita",
      "Vitaminas e suplementos",
      "Higiene pessoal e perfumaria",
      "Fraldas e cuidados infantis",
      "Aferição de pressão",
    ],
    contact: {
      phone: "(85) 3336-9012",
      whatsapp: "5585933369012",
    },
    featured: true,
  },
  {
    slug: "zenir-moveis",
    name: "Zenir Móveis",
    tagline: "Móveis planejados e eletros com entrega local",
    category: "Móveis e Decoração",
    city: "Horizonte",
    region: "CE",
    description:
      "Uma das lojas mais conhecidas da Castelo Branco. Referência em móveis para casa e eletrodomésticos, com condições de pagamento acessíveis e entrega na região.",
    services: [
      "Móveis para sala e quarto",
      "Cozinhas planejadas",
      "Eletrodomésticos em geral",
      "Colchões e estofados",
      "Entrega e montagem local",
    ],
    contact: {
      phone: "(85) 4020-5050",
      whatsapp: "5585940205050",
    },
    featured: true,
  },
  {
    slug: "construtora-horizonte",
    name: "Depósito Horizonte",
    tagline: "Material de construção com preço de obra",
    category: "Construção e Reforma",
    city: "Horizonte",
    region: "CE",
    description:
      "Depósito de material de construção que atende desde o pedreiro até a construtora. Cimento, areia, tintas, ferragens e tudo que a obra precisa, com entrega rápida na região.",
    services: [
      "Cimento, cal e argamassa",
      "Tintas e acabamentos",
      "Ferragens e ferramentas",
      "Material hidráulico e elétrico",
      "Entrega em obra",
    ],
    contact: {
      phone: "(85) 3336-3456",
      whatsapp: "5585933363456",
    },
    featured: false,
  },
];

export function getPartnerBySlug(slug: string): Partner | null {
  return partners.find((p) => p.slug === slug) ?? null;
}

export function getFeaturedPartners(): Partner[] {
  return partners.filter((p) => p.featured);
}

export function getAllPartners(): Partner[] {
  return partners;
}
