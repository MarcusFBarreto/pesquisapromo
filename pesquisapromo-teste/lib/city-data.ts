import { assessVerifiedDiscount, type PricePoint } from "@/lib/verified-discount";

export type AreaKind = "avenidas" | "ruas" | "travessas";
export type VerificationStatus = "public" | "checkable" | "official";

export type Area = {
  slug: string;
  kind: AreaKind;
  name: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  mood: string;
  accent: string;
  route: string;
  shopSlugs: string[];
  keywords: string[];
};

export type ServiceHighlight = {
  title: string;
  detail: string;
};

export type Shop = {
  slug: string;
  name: string;
  areaSlug: string;
  areaKind: AreaKind;
  style: "comparative" | "spotlight" | "vitrine" | "utility";
  summary: string;
  detail: string;
  route: string;
  keywords: string[];
  featuredOfferId?: string;
  verification: VerificationStatus;
  address: string;
  contact?: string;
  sourceLabel: string;
  sourceUrl: string;
  serviceHighlights?: ServiceHighlight[];
};

export type Offer = {
  id: string;
  shopSlug: string;
  title: string;
  storeName: string;
  category: string;
  rating: number;
  currentPrice: number;
  previousLabel?: string;
  note: string;
  keywords: string[];
  history: PricePoint[];
};

type DestinationKind = "area" | "shop" | "offer";

export type Destination = {
  kind: DestinationKind;
  title: string;
  subtitle: string;
  route: string;
  keywords: string[];
  score: number;
};

export const areas: Area[] = [
  {
    slug: "grandes-promocoes",
    kind: "avenidas",
    name: "Avenida Grandes Promocoes",
    eyebrow: "Eixo Castelo Branco",
    subtitle: "Avenida inspirada no corredor comercial mais forte de Horizonte.",
    description:
      "Um eixo de leitura rapida para o que esta se destacando no comercio local, com foco em oportunidade, movimento e contexto de queda real.",
    mood: "Mais impacto visual, mais fluxo e mais urgencia organizada.",
    accent: "amber",
    route: "/avenidas/grandes-promocoes",
    shopSlugs: ["achado-do-dia", "radar-da-semana", "farmacia-caminho-popular"],
    keywords: ["promocoes", "avenida", "castelo branco", "desconto", "destaques", "farmacia"],
  },
  {
    slug: "casa",
    kind: "ruas",
    name: "Rua da Casa",
    eyebrow: "Decisao com calma",
    subtitle: "Moveis, eletros e comparacao usando referencias reais de Horizonte.",
    description:
      "Uma rua inspirada em lojas encontradas no eixo comercial da cidade, com leitura mais serena e utilitaria para casa, moveis e eletros.",
    mood: "Mais sobria, mais pratica e menos barulhenta.",
    accent: "blue",
    route: "/ruas/casa",
    shopSlugs: ["comparador-de-geladeiras", "casa-em-claro"],
    keywords: ["geladeira", "casa", "cozinha", "eletrodomesticos", "zenir", "leleo moveis"],
  },
  {
    slug: "calcados",
    kind: "ruas",
    name: "Rua dos Calcados",
    eyebrow: "Passeio de vitrine",
    subtitle: "Uma area ainda mais generica, boa para testar a camada nao verificada.",
    description:
      "Aqui o prototipo mistura achados genericos de calcados com a ideia de uma rua viva. E um bom lugar para ensaiar o ecossistema nao verificado.",
    mood: "Mais leve, mais de passeio e mais de descoberta.",
    accent: "blue",
    route: "/ruas/calcados",
    shopSlugs: ["outlet-do-tenis", "passo-urbano"],
    keywords: ["tenis", "calcados", "sandalia", "sapato", "outlet", "rua dos calcados"],
  },
  {
    slug: "achadinhos",
    kind: "travessas",
    name: "Travessa dos Achadinhos",
    eyebrow: "Descoberta curta",
    subtitle: "Pequenos achados publicos e lojas de giro rapido.",
    description:
      "Uma travessa para misturar papelaria, pequenas vitrines e achados com cara de oportunidade publica encontrada na cidade.",
    mood: "Mais agil, mais curta e mais curiosa.",
    accent: "orange",
    route: "/travessas/achadinhos",
    shopSlugs: ["achado-do-dia", "bolso-feliz", "art-ton-papelaria"],
    keywords: ["achado", "travessa", "papelaria", "fone", "descoberta", "livraria"],
  },
  {
    slug: "servicos",
    kind: "ruas",
    name: "Rua dos Servicos",
    eyebrow: "Utilidade publica",
    subtitle: "Orgaos e atalhos oficiais de Horizonte, com cara de servico que ajuda.",
    description:
      "Uma rua mais objetiva, pensada para reunir prefeitura, saude, demutran e outros pontos de utilidade. Aqui o valor e resolver, nao vender.",
    mood: "Mais calma, mais confiavel e mais institucional.",
    accent: "teal",
    route: "/ruas/servicos",
    shopSlugs: ["casa-da-prefeitura", "saude-horizonte", "demutran-horizonte", "hospital-municipal"],
    keywords: ["servicos", "prefeitura", "saude", "upa", "hospital", "demutran", "ouvidoria"],
  },
];

export const shops: Shop[] = [
  {
    slug: "comparador-de-geladeiras",
    name: "Comparador de Geladeiras",
    areaSlug: "casa",
    areaKind: "ruas",
    style: "comparative",
    summary: "Compara referencias locais como Zenir Moveis e J Erivaldo & Cia.",
    detail:
      "Esta lojinha cruza dados publicos de lojas reais de Horizonte com uma camada simulada de historico de preco. Ela existe para testar o que seria uma comparacao crivel entre vitrines locais.",
    route: "/lojas/comparador-de-geladeiras",
    keywords: ["geladeira", "frost free", "comparador", "refrigerador", "zenir", "erivaldo"],
    featuredOfferId: "geladeira-brastemp",
    verification: "checkable",
    address: "Av. Presidente Castelo Branco, Centro, Horizonte/CE",
    sourceLabel: "Diario Cidade",
    sourceUrl: "https://www.diariocidade.com/ce/horizonte/guia/j-erivaldo-cia-ltda-06001044003480/",
  },
  {
    slug: "casa-em-claro",
    name: "Casa em Claro",
    areaSlug: "casa",
    areaKind: "ruas",
    style: "vitrine",
    summary: "Uma leitura mais editorial de moveis e eletros do eixo comercial local.",
    detail:
      "Inspirada em lojas reais encontradas na avenida principal, ela funciona como uma vitrine limpa para testar o lado mais elegante da Rua da Casa.",
    route: "/lojas/casa-em-claro",
    keywords: ["air fryer", "casa", "utilidades", "moveis", "zenir"],
    featuredOfferId: "air-fryer-clara",
    verification: "checkable",
    address: "Av. Presidente Castelo Branco, 4718, Centro, Horizonte/CE",
    contact: "(85) 4020-5050",
    sourceLabel: "Diario Cidade",
    sourceUrl: "https://www.diariocidade.com/ce/horizonte/guia/zenir-moveis-41426966004160/",
  },
  {
    slug: "outlet-do-tenis",
    name: "Outlet do Tenis",
    areaSlug: "calcados",
    areaKind: "ruas",
    style: "vitrine",
    summary: "Uma camada generica e nao verificada para testar a rua de calcados.",
    detail:
      "Ainda nao nasce ancorada em uma fonte forte da cidade. E parte do ecossistema generico, util para ensaiar como lidar com lojas ainda nao verificadas.",
    route: "/lojas/outlet-do-tenis",
    keywords: ["tenis", "corrida", "casual", "urbano", "nao verificado"],
    featuredOfferId: "tenis-urban-run",
    verification: "public",
    address: "Endereco em observacao, Horizonte/CE",
    sourceLabel: "Camada generica do laboratorio",
    sourceUrl: "http://localhost:3001/lojas/outlet-do-tenis",
  },
  {
    slug: "passo-urbano",
    name: "Passo Urbano",
    areaSlug: "calcados",
    areaKind: "ruas",
    style: "vitrine",
    summary: "Outra lojinha generica para testar convivio entre fantasia e utilidade.",
    detail:
      "Serve para ensaiar como a cidade pode conviver com lojas ainda nao confirmadas, sem fingir que elas ja estao verificadas.",
    route: "/lojas/passo-urbano",
    keywords: ["sandalia", "casual", "papete", "tenis", "nao verificado"],
    featuredOfferId: "sandalia-vento",
    verification: "public",
    address: "Endereco em observacao, Horizonte/CE",
    sourceLabel: "Camada generica do laboratorio",
    sourceUrl: "http://localhost:3001/lojas/passo-urbano",
  },
  {
    slug: "achado-do-dia",
    name: "Achado do Dia",
    areaSlug: "achadinhos",
    areaKind: "travessas",
    style: "spotlight",
    summary: "Oportunidades encontradas no comercio local e recortadas como destaque.",
    detail:
      "Esta vitrine funciona como um recorte editorial do que parece valer a pena hoje, sem apelar para linguagem agressiva e deixando claro de onde os dados vieram.",
    route: "/lojas/achado-do-dia",
    keywords: ["achado", "oportunidade", "fone", "desconto verificado", "castelo branco"],
    featuredOfferId: "fone-wave-pro",
    verification: "checkable",
    address: "Av. Presidente Castelo Branco, Centro, Horizonte/CE",
    sourceLabel: "Diario Cidade",
    sourceUrl: "https://www.diariocidade.com/ce/horizonte/guia/farmacia-caminho-popular-41123351000177/",
  },
  {
    slug: "art-ton-papelaria",
    name: "Art & Ton Papelaria",
    areaSlug: "achadinhos",
    areaKind: "travessas",
    style: "vitrine",
    summary: "Papelaria real encontrada em Horizonte, boa para um achado mais cotidiano.",
    detail:
      "Uma forma de testar como lojas publicas de papelaria e livraria podem entrar na cidade sem parecerem enxerto.",
    route: "/lojas/art-ton-papelaria",
    keywords: ["papelaria", "livraria", "caderno", "art ton", "escolar"],
    featuredOfferId: "kit-escolar-ton",
    verification: "checkable",
    address: "Av. Presidente Castelo Branco, 4554, Centro, Horizonte/CE",
    sourceLabel: "Diario Cidade",
    sourceUrl: "https://www.diariocidade.com/ce/horizonte/guia/art-ton-livraria-e-grafica-03496998000155/amp/",
  },
  {
    slug: "farmacia-caminho-popular",
    name: "Farmacia Caminho Popular",
    areaSlug: "grandes-promocoes",
    areaKind: "avenidas",
    style: "spotlight",
    summary: "Exemplo forte de loja publica local com endereco identificavel e leitura simples.",
    detail:
      "Ajuda a testar uma vitrine mais popular e cotidiana dentro da avenida, ancorada em um comercio real encontrado em fonte publica.",
    route: "/lojas/farmacia-caminho-popular",
    keywords: ["farmacia", "popular", "medicamento", "perfumaria", "castelo branco"],
    featuredOfferId: "vitamina-caminho",
    verification: "checkable",
    address: "Av. Presidente Castelo Branco, 5437, Centro, Horizonte/CE",
    sourceLabel: "Diario Cidade",
    sourceUrl: "https://www.diariocidade.com/ce/horizonte/guia/farmacia-caminho-popular-41123351000177/",
  },
  {
    slug: "radar-da-semana",
    name: "Radar da Semana",
    areaSlug: "grandes-promocoes",
    areaKind: "avenidas",
    style: "spotlight",
    summary: "Leitura editorial do que parece forte hoje no eixo comercial.",
    detail:
      "Cruza alguns sinais de destaque e organiza a avenida em algo exploravel, sem virar panfleto.",
    route: "/lojas/radar-da-semana",
    keywords: ["promocoes", "semana", "queda real", "destaque", "avenida"],
    featuredOfferId: "purificador-brisa",
    verification: "public",
    address: "Av. Presidente Castelo Branco, Centro, Horizonte/CE",
    sourceLabel: "Curadoria do laboratorio",
    sourceUrl: "http://localhost:3001/avenidas/grandes-promocoes",
  },
  {
    slug: "bolso-feliz",
    name: "Bolso Feliz",
    areaSlug: "achadinhos",
    areaKind: "travessas",
    style: "spotlight",
    summary: "Pequenos achados de giro rapido para testar descoberta.",
    detail:
      "Funciona como uma lojinha mista: um pouco de editorial, um pouco de oportunidade. Boa para ensaiar rotatividade de ofertas.",
    route: "/lojas/bolso-feliz",
    keywords: ["achado", "caixa bluetooth", "descoberta", "dia"],
    featuredOfferId: "caixa-onda-mini",
    verification: "public",
    address: "Travessa em observacao, Horizonte/CE",
    sourceLabel: "Curadoria do laboratorio",
    sourceUrl: "http://localhost:3001/travessas/achadinhos",
  },
  {
    slug: "casa-da-prefeitura",
    name: "Casa da Prefeitura",
    areaSlug: "servicos",
    areaKind: "ruas",
    style: "utility",
    summary: "Porta de entrada para servicos municipais, ouvidoria e informacoes oficiais.",
    detail:
      "Aqui a cidade deixa de vender e passa a resolver. E um ponto de apoio para quem quer atalhos oficiais dentro do ecossistema.",
    route: "/lojas/casa-da-prefeitura",
    keywords: ["prefeitura", "ouvidoria", "esic", "servicos", "horizonte"],
    verification: "official",
    address: "Av. Presidente Castelo Branco, 5100, Centro, Horizonte/CE",
    sourceLabel: "Prefeitura de Horizonte",
    sourceUrl: "https://www.horizonte.ce.gov.br/",
    serviceHighlights: [
      {
        title: "Ouvidoria e E-SIC",
        detail: "Canal institucional para pedidos de informacao e manifestacoes.",
      },
      {
        title: "Servicos por secretaria",
        detail: "Atalhos oficiais organizados por area administrativa.",
      },
    ],
  },
  {
    slug: "saude-horizonte",
    name: "Saude Horizonte",
    areaSlug: "servicos",
    areaKind: "ruas",
    style: "utility",
    summary: "Secretaria de Saude, UPA e caminhos publicos de atendimento.",
    detail:
      "Uma lojinha de utilidade para transformar informacao institucional em navegacao clara. Ela nao vende nada: orienta.",
    route: "/lojas/saude-horizonte",
    keywords: ["saude", "upa", "secretaria de saude", "ubs", "hospital"],
    verification: "official",
    address: "Av. Presidente Castelo Branco, 3600, Centro, Horizonte/CE",
    sourceLabel: "Prefeitura de Horizonte",
    sourceUrl: "https://www.horizonte.ce.gov.br/secretaria.php?sec=8",
    serviceHighlights: [
      {
        title: "Secretaria de Saude",
        detail: "Contato institucional e informacoes da rede municipal.",
      },
      {
        title: "Unidades basicas e UPA",
        detail: "Mapeamento inicial de caminhos de atendimento em Horizonte.",
      },
    ],
  },
  {
    slug: "demutran-horizonte",
    name: "DEMUTRAN Horizonte",
    areaSlug: "servicos",
    areaKind: "ruas",
    style: "utility",
    summary: "Atalhos de transito, formularios e orientacoes publicas.",
    detail:
      "Boa para ensaiar como a Rua dos Servicos pode lidar com orgaos mais tecnicos sem perder clareza.",
    route: "/lojas/demutran-horizonte",
    keywords: ["demutran", "transito", "formularios", "servicos", "horizonte"],
    verification: "official",
    address: "Horizonte/CE",
    sourceLabel: "Prefeitura de Horizonte",
    sourceUrl: "https://www.horizonte.ce.gov.br/serv_cidadao/demutran-2/",
    serviceHighlights: [
      {
        title: "Atendimento de transito",
        detail: "Informacoes oficiais do DEMUTRAN municipal.",
      },
      {
        title: "Formularios",
        detail: "Acesso a documentos e caminhos publicos ligados ao orgao.",
      },
    ],
  },
  {
    slug: "hospital-municipal",
    name: "Hospital Municipal",
    areaSlug: "servicos",
    areaKind: "ruas",
    style: "utility",
    summary: "Entrada para informacoes do Hospital Municipal Venancio Raimundo de Sousa.",
    detail:
      "Ajuda a testar um modelo de servico publico mais sensivel, onde a interface precisa ser discreta, clara e respeitosa.",
    route: "/lojas/hospital-municipal",
    keywords: ["hospital", "municipal", "venancio", "saude", "zumbi"],
    verification: "official",
    address: "Rua Maria Luiza Noronha, 45, Zumbi, Horizonte/CE",
    sourceLabel: "Prefeitura de Horizonte",
    sourceUrl: "https://www.horizonte.ce.gov.br/noticia/servicos-oferecidos-pelo-hospital-municipal/",
    serviceHighlights: [
      {
        title: "Informacoes do hospital",
        detail: "Conteudo institucional sobre servicos e atendimento.",
      },
      {
        title: "Rede publica de saude",
        detail: "Ponto de continuidade para UPA e unidades basicas.",
      },
    ],
  },
];

export const offers: Offer[] = [
  {
    id: "geladeira-brastemp",
    shopSlug: "comparador-de-geladeiras",
    title: "Geladeira Brastemp Frost Free 375L",
    storeName: "J Erivaldo & Cia",
    category: "geladeira",
    rating: 4.8,
    currentPrice: 2899,
    previousLabel: "estava por R$ 3.499 na mesma vitrine simulada",
    note: "Comparacao inspirada em comercio real de Horizonte, com historico mockado para validar o conceito.",
    keywords: ["geladeira", "brastemp", "375l", "frost free", "casa", "horizonte"],
    history: [
      { date: "2026-03-01", price: 3499 },
      { date: "2026-03-08", price: 3449 },
      { date: "2026-03-15", price: 3349 },
      { date: "2026-03-22", price: 3199 },
      { date: "2026-03-27", price: 2899 },
    ],
  },
  {
    id: "geladeira-electrolux",
    shopSlug: "comparador-de-geladeiras",
    title: "Geladeira Electrolux Inverter 390L",
    storeName: "Zenir Moveis",
    category: "geladeira",
    rating: 4.6,
    currentPrice: 3199,
    previousLabel: "preco bom, mas sem a mesma intensidade de queda",
    note: "Ajuda a mostrar a diferenca entre bom preco e desconto verificado.",
    keywords: ["geladeira", "electrolux", "390l", "inverter", "casa", "zenir"],
    history: [
      { date: "2026-03-01", price: 3299 },
      { date: "2026-03-08", price: 3279 },
      { date: "2026-03-15", price: 3249 },
      { date: "2026-03-22", price: 3229 },
      { date: "2026-03-27", price: 3199 },
    ],
  },
  {
    id: "air-fryer-clara",
    shopSlug: "casa-em-claro",
    title: "Air Fryer Clara 5L",
    storeName: "Zenir Moveis",
    category: "air fryer",
    rating: 4.5,
    currentPrice: 299,
    previousLabel: "ha poucos registros desta vitrine",
    note: "Boa para ilustrar a camada em observacao dentro de um comercio local identificavel.",
    keywords: ["air fryer", "casa", "cozinha", "fritadeira", "zenir"],
    history: [
      { date: "2026-03-18", price: 349 },
      { date: "2026-03-23", price: 329 },
      { date: "2026-03-27", price: 299 },
    ],
  },
  {
    id: "tenis-urban-run",
    shopSlug: "outlet-do-tenis",
    title: "Tenis Urban Run Knit",
    storeName: "Outlet do Tenis",
    category: "tenis",
    rating: 4.7,
    currentPrice: 239.9,
    previousLabel: "camada generica ainda nao verificada",
    note: "Serve para ensaiar o ecossistema misto: utilidade real convivendo com vitrines ainda em observacao.",
    keywords: ["tenis", "urban", "calcados", "casual", "outlet"],
    history: [
      { date: "2026-03-03", price: 299.9 },
      { date: "2026-03-10", price: 289.9 },
      { date: "2026-03-17", price: 279.9 },
      { date: "2026-03-24", price: 259.9 },
      { date: "2026-03-27", price: 239.9 },
    ],
  },
  {
    id: "sandalia-vento",
    shopSlug: "passo-urbano",
    title: "Sandalia Vento Leve",
    storeName: "Passo Urbano",
    category: "sandalia",
    rating: 4.4,
    currentPrice: 89.9,
    previousLabel: "preco bom, ainda em observacao",
    note: "Outro exemplo de loja ainda nao confirmada, util para testar sinalizacao de confianca.",
    keywords: ["sandalia", "calcados", "papete", "leve"],
    history: [
      { date: "2026-03-06", price: 99.9 },
      { date: "2026-03-13", price: 94.9 },
      { date: "2026-03-27", price: 89.9 },
    ],
  },
  {
    id: "fone-wave-pro",
    shopSlug: "achado-do-dia",
    title: "Fone Bluetooth Wave Pro",
    storeName: "Achado do Dia",
    category: "fone",
    rating: 4.5,
    currentPrice: 179.9,
    previousLabel: "estava por R$ 239,90 na mesma vitrine simulada",
    note: "Um achado com cara de oportunidade real, mas ainda assumidamente curado.",
    keywords: ["fone", "bluetooth", "achado", "promo", "audio"],
    history: [
      { date: "2026-03-01", price: 239.9 },
      { date: "2026-03-08", price: 229.9 },
      { date: "2026-03-15", price: 219.9 },
      { date: "2026-03-22", price: 199.9 },
      { date: "2026-03-27", price: 179.9 },
    ],
  },
  {
    id: "kit-escolar-ton",
    shopSlug: "art-ton-papelaria",
    title: "Kit escolar essencial",
    storeName: "Art & Ton Papelaria",
    category: "papelaria",
    rating: 4.4,
    currentPrice: 94.9,
    previousLabel: "menor preco recente nesta loja",
    note: "Ajuda a trazer comercio de papelaria para dentro da cidade de forma crivel.",
    keywords: ["papelaria", "caderno", "escola", "kit escolar", "art ton"],
    history: [
      { date: "2026-03-05", price: 129.9 },
      { date: "2026-03-12", price: 119.9 },
      { date: "2026-03-19", price: 109.9 },
      { date: "2026-03-27", price: 94.9 },
    ],
  },
  {
    id: "vitamina-caminho",
    shopSlug: "farmacia-caminho-popular",
    title: "Vitamina C 1g com 30 comprimidos",
    storeName: "Farmacia Caminho Popular",
    category: "farmacia",
    rating: 4.5,
    currentPrice: 39.9,
    previousLabel: "queda moderada, mas consistente",
    note: "Exemplo de item farmaceutico/perfumaria usado para ensaiar a avenida.",
    keywords: ["farmacia", "vitamina", "popular", "medicamento", "promo"],
    history: [
      { date: "2026-03-03", price: 49.9 },
      { date: "2026-03-10", price: 47.9 },
      { date: "2026-03-17", price: 44.9 },
      { date: "2026-03-27", price: 39.9 },
    ],
  },
  {
    id: "caixa-onda-mini",
    shopSlug: "bolso-feliz",
    title: "Caixa Onda Mini",
    storeName: "Bolso Feliz",
    category: "caixa de som",
    rating: 4.3,
    currentPrice: 129.9,
    previousLabel: "queda pequena, mas consistente",
    note: "Boa para quem quer economizar sem esperar uma liquidacao inteira.",
    keywords: ["caixa", "som", "achado", "bluetooth"],
    history: [
      { date: "2026-03-04", price: 149.9 },
      { date: "2026-03-11", price: 144.9 },
      { date: "2026-03-18", price: 139.9 },
      { date: "2026-03-27", price: 129.9 },
    ],
  },
  {
    id: "purificador-brisa",
    shopSlug: "radar-da-semana",
    title: "Purificador Brisa Inox",
    storeName: "Radar da Semana",
    category: "purificador",
    rating: 4.4,
    currentPrice: 499,
    previousLabel: "quase um quarto abaixo do preco recente",
    note: "Exemplo de destaque forte da avenida sem perder a confianca.",
    keywords: ["purificador", "promocao", "avenida", "casa"],
    history: [
      { date: "2026-03-02", price: 649 },
      { date: "2026-03-09", price: 629 },
      { date: "2026-03-16", price: 619 },
      { date: "2026-03-23", price: 589 },
      { date: "2026-03-27", price: 499 },
    ],
  },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function getVerificationMeta(status: VerificationStatus) {
  if (status === "official") {
    return {
      label: "Oficial",
      detail: "Fonte institucional checavel",
      className: "border-teal-200 bg-teal-50 text-teal-800",
    };
  }

  if (status === "checkable") {
    return {
      label: "Mais verificavel",
      detail: "Dados publicos com sinais conferiveis",
      className: "border-blue-200 bg-blue-50 text-blue-800",
    };
  }

  return {
    label: "Nao verificado",
    detail: "Encontrado publicamente, ainda em observacao",
    className: "border-slate-200 bg-slate-100 text-slate-700",
  };
}

export function getArea(kind: AreaKind, slug: string) {
  return areas.find((area) => area.kind === kind && area.slug === slug);
}

export function getAreasByKind(kind: AreaKind) {
  return areas.filter((area) => area.kind === kind);
}

export function getShop(slug: string) {
  return shops.find((shop) => shop.slug === slug);
}

export function getShopsByArea(areaSlug: string) {
  return shops.filter((shop) => shop.areaSlug === areaSlug);
}

export function getOffersByShop(shopSlug: string) {
  return offers
    .filter((offer) => offer.shopSlug === shopSlug)
    .map((offer) => ({
      ...offer,
      discount: assessVerifiedDiscount(offer.history),
    }));
}

export function getOffer(offerId: string) {
  const offer = offers.find((entry) => entry.id === offerId);
  return offer
    ? {
        ...offer,
        discount: assessVerifiedDiscount(offer.history),
      }
    : undefined;
}

export function getOffersByArea(areaSlug: string) {
  return getShopsByArea(areaSlug).flatMap((shop) => getOffersByShop(shop.slug));
}

export function getTopOffers(limit = 4) {
  return offers
    .map((offer) => ({
      ...offer,
      discount: assessVerifiedDiscount(offer.history),
    }))
    .sort((left, right) => {
      const leftScore = left.discount.status === "verified" ? 3 : left.discount.status === "recent-low" ? 2 : 1;
      const rightScore = right.discount.status === "verified" ? 3 : right.discount.status === "recent-low" ? 2 : 1;
      return rightScore - leftScore || left.currentPrice - right.currentPrice;
    })
    .slice(0, limit);
}

function scoreMatch(query: string, values: string[]) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return 0;
  }

  return values.reduce((score, value) => {
    const normalizedValue = value.toLowerCase();

    if (normalizedValue === normalizedQuery) {
      return score + 8;
    }

    if (normalizedValue.startsWith(normalizedQuery)) {
      return score + 5;
    }

    if (normalizedValue.includes(normalizedQuery)) {
      return score + 3;
    }

    return score;
  }, 0);
}

export function getDestinations(): Destination[] {
  const areaDestinations: Destination[] = areas.map((area) => ({
    kind: "area",
    title: area.name,
    subtitle: area.subtitle,
    route: area.route,
    keywords: [area.name, area.subtitle, ...area.keywords],
    score: 0,
  }));

  const shopDestinations: Destination[] = shops.map((shop) => ({
    kind: "shop",
    title: shop.name,
    subtitle: shop.summary,
    route: shop.route,
    keywords: [shop.name, shop.summary, shop.address, ...shop.keywords],
    score: 0,
  }));

  const offerDestinations: Destination[] = offers.map((offer) => ({
    kind: "offer",
    title: offer.title,
    subtitle: `${offer.storeName} · ${formatCurrency(offer.currentPrice)}`,
    route: getShop(offer.shopSlug)?.route ?? "/",
    keywords: [offer.title, offer.storeName, offer.category, ...offer.keywords],
    score: 0,
  }));

  return [...areaDestinations, ...shopDestinations, ...offerDestinations];
}

export function getSearchSuggestions(query: string, limit = 6) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return getTopOffers(3).map((offer) => ({
      kind: "offer" as const,
      title: offer.title,
      subtitle: `${getShop(offer.shopSlug)?.name ?? offer.storeName} · ${offer.discount.shortLabel}`,
      route: getShop(offer.shopSlug)?.route ?? "/",
      score: 1,
    }));
  }

  return getDestinations()
    .map((destination) => ({
      ...destination,
      score: scoreMatch(normalizedQuery, destination.keywords),
    }))
    .filter((destination) => destination.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export function resolveDestination(query: string) {
  return getSearchSuggestions(query, 1)[0] ?? null;
}

export function searchCity(query: string) {
  const suggestions = getSearchSuggestions(query, 8);
  const areaMatches = areas.filter((area) => scoreMatch(query, [area.name, ...area.keywords]) > 0);
  const shopMatches = shops.filter((shop) => scoreMatch(query, [shop.name, shop.address, ...shop.keywords]) > 0);
  const offerMatches = offers
    .filter((offer) => scoreMatch(query, [offer.title, offer.category, ...offer.keywords]) > 0)
    .map((offer) => ({
      ...offer,
      discount: assessVerifiedDiscount(offer.history),
    }));

  return {
    suggestions,
    areaMatches,
    shopMatches,
    offerMatches,
    bestRoute: resolveDestination(query),
  };
}

export const taxiPrompts = [
  "geladeira",
  "farmacia",
  "papelaria",
  "demutran",
  "hospital",
  "promocoes",
] as const;
