export type DistrictType = "setores" | "vitrines";

export type TestShop = {
  slug?: string;
  name: string;
  street: string;
  vibe: string;
  badge: string;
  offer: string;
  products?: string[];
  verification?: "nao verificado" | "mais verificavel" | "oficial";
  address?: string;
  contact?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  services?: string[];
};

export type District = {
  slug: string;
  type: DistrictType;
  title: string;
  subtitle: string;
  count: string;
  intro: string;
  highlight: string;
  pulse: string;
  shops: TestShop[];
};

export const featuredDeals = [
  {
    item: "Geladeira Brastemp Frost Free 375L",
    store: "J Erivaldo & Cia · Piloto",
    price: "R$ 2.899",
    note: "queda real simulada com base em parceiro local",
  },
  {
    item: "Kit escolar essencial",
    store: "Art & Ton Papelaria · Piloto",
    price: "R$ 94,90",
    note: "menor preço recente neste parceiro",
  },
  {
    item: "Vitamina C 1g",
    store: "Farmácia Caminho Popular · Piloto",
    price: "R$ 39,90",
    note: "achado verificado com leitura mais crível",
  },
] as const;

export const steps = [
  "Busque o que voce precisa e veja onde esta mais barato por perto.",
  "Se quiser, peça ajuda e diga em quanto tempo precisa de resposta.",
  "Quem puder atender entra em contato com voce.",
] as const;

export const districts: District[] = [
  {
    slug: "calcados",
    type: "setores",
    title: "Setor de Calcados",
    subtitle: "Tenis, sandalias, chinelos e vitrines para toda a familia",
    count: "38 lojinhas",
    intro:
      "Uma rua para quem gosta de bater perna atras de tenis, sandalia, sapato e achados que resolvem o dia a dia.",
    highlight: "Vitrines mais visitadas da semana",
    pulse: "Movimento bom e oferta aparecendo toda hora",
    shops: [
      {
        name: "Passo Leve",
        street: "Setor de Calcados",
        vibe: "Tenis, sandalias e achados para o dia a dia",
        badge: "vitrine aberta",
        offer: "Sandalia rasteira por R$ 79",
        products: ["sandalia rasteira", "chinelo macio", "tenis casual"],
      },
      {
        name: "Pisa Fofo",
        street: "Rua dos Calcados",
        vibe: "Calcados infantis e escolhas confortaveis para a familia",
        badge: "mais visitada",
        offer: "Tenis infantil por R$ 119",
        products: ["tenis infantil", "sandalia infantil", "papete"],
      },
      {
        name: "Seu Passo",
        street: "Rua dos Calcados",
        vibe: "Sapatos sociais, mocassins e vitrines mais arrumadas",
        badge: "acabou de baixar",
        offer: "Mocassim por R$ 139",
        products: ["mocassim", "sapato social", "tenis urbano"],
      },
      {
        name: "Ponto do Tenis",
        street: "Rua dos Calcados",
        vibe: "Tenis casuais, esportivos e aquele achado inesperado",
        badge: "movimento forte",
        offer: "Tenis urbano por R$ 169",
        products: ["tenis urbano", "tenis esportivo", "meia esportiva"],
      },
    ],
  },
  {
    slug: "casa",
    type: "setores",
    title: "Setor da Casa",
    subtitle: "Moveis, eletros, reforma e achados para o lar",
    count: "52 lojinhas",
    intro:
      "Uma rua para olhar com calma e ir montando a casa aos poucos, sem perder uma boa oportunidade.",
    highlight: "Achados para cozinha, sala e cantinhos da casa",
    pulse: "Sempre tem alguma vitrine chamando atencao",
    shops: [
      {
        slug: "comparador-de-geladeiras",
        name: "Comparador de Geladeiras",
        street: "Setor da Casa",
        vibe: "Comparação mais serena, inspirada em lojas reais como J Erivaldo & Cia e Zenir Móveis.",
        badge: "mais verificavel",
        offer: "Geladeira Brastemp Frost Free 375L por R$ 2.899",
        products: ["geladeira frost free", "geladeira brastemp", "geladeira electrolux"],
        verification: "mais verificavel",
        address: "Av. Presidente Castelo Branco, Centro, Piloto/CE",
        sourceLabel: "Diario Cidade",
        sourceUrl: "https://www.diariocidade.com/ce/horizonte/guia/j-erivaldo-cia-ltda-06001044003480/",
      },
      {
        name: "Zenir Moveis",
        street: "Rua da Casa",
        vibe: "Uma vitrine mais conhecida, boa para moveis, eletros e leitura limpa do preco local.",
        badge: "mais verificavel",
        offer: "Air fryer por R$ 299",
        products: ["air fryer", "moveis", "eletrodomesticos"],
        verification: "mais verificavel",
        address: "Av. Presidente Castelo Branco, 4718, Centro, Cidade Piloto/CE",
        contact: "(85) 4020-5050",
        sourceLabel: "Diario Cidade",
        sourceUrl: "https://www.diariocidade.com/ce/horizonte/guia/zenir-moveis-41426966004160/",
      },
      {
        name: "Casa Bonita",
        street: "Rua da Casa",
        vibe: "Utilidades, pequenos moveis e promos da semana",
        badge: "vitrine de apoio",
        offer: "Organizador por R$ 39",
        products: ["organizador", "cabide", "cesto multiuso"],
      },
      {
        name: "Jeito de Lar",
        street: "Rua da Casa",
        vibe: "Mesa posta, decoracao leve e detalhes que mudam o ambiente",
        badge: "nova vitrine",
        offer: "Conjunto de pratos por R$ 89",
        products: ["conjunto de pratos", "jogo de panelas", "toalha de mesa"],
      },
    ],
  },
  {
    slug: "testes",
    type: "setores",
    title: "Setor de Testes",
    subtitle: "Laboratorio para ideias, layouts e experiencias simuladas",
    count: "12 lojinhas de teste",
    intro:
      "Esta rua existe para nossos experimentos. Aqui podemos testar vitrines, interacoes, gamificacao e ideias novas sem mexer nas ruas principais.",
    highlight: "Territorio livre para montar, desmontar e validar",
    pulse: "Tudo aqui pode mudar rapido, e esse e justamente o objetivo",
    shops: [
      {
        slug: "lojinha-alfa",
        name: "Lojinha Alfa",
        street: "Rua dos Testes",
        vibe: "Primeira vitrine para testar formatos, selos e chamadas",
        badge: "modo laboratorio",
        offer: "Produto piloto por R$ 59",
        products: ["produto piloto", "caixa surpresa", "kit alfa"],
      },
      {
        name: "Beta & Cia",
        street: "Rua dos Testes",
        vibe: "Espaco para brincar com cards, comparacoes e destaque visual",
        badge: "teste visual",
        offer: "Oferta beta por R$ 129",
        products: ["oferta beta", "kit alfa", "display de teste"],
      },
      {
        name: "Oficina Gamma",
        street: "Rua dos Testes",
        vibe: "Vitrine pensada para ensaiar novas interacoes da rua",
        badge: "em observacao",
        offer: "Kit experimental por R$ 89",
        products: ["kit experimental", "brinquedo surpresa", "bloco criativo"],
      },
      {
        name: "Vitrine Delta",
        street: "Rua dos Testes",
        vibe: "Lugar para validar textos, caminhos e mini jornadas",
        badge: "fluxo novo",
        offer: "Pacote demo por R$ 149",
        products: ["pacote demo", "jogo de montar", "caixa interativa"],
      },
      {
        name: "Estudio Epsilon",
        street: "Rua dos Testes",
        vibe: "Ambiente para testar cores, hierarquia e sensacao de passeio",
        badge: "ensaio aberto",
        offer: "Combo prototipo por R$ 99",
        products: ["combo prototipo", "quebra-cabeca", "cartas divertidas"],
      },
      {
        name: "Lab Zeta",
        street: "Rua dos Testes",
        vibe: "Uma lojinha feita para testar a terceira camada do mapa",
        badge: "proximo passo",
        offer: "Oferta sandbox por R$ 179",
        products: ["oferta sandbox", "mini game", "boneco articulado"],
      },
    ],
  },
  {
    slug: "servicos",
    type: "setores",
    title: "Setor de Servicos",
    subtitle: "Atalhos confiaveis para utilidades, cidadania e links oficiais",
    count: "8 portas uteis",
    intro:
      "Uma rua pensada para reunir servicos publicos, utilidades gratuitas e atalhos confiaveis do dia a dia, sempre com clareza e sem misturar com vitrines comerciais.",
    highlight: "Espaço voltado para resolver e facilitar",
    pulse: "Mais calma, mais objetiva e com cara de servico que ajuda",
    shops: [
      {
        slug: "casa-da-prefeitura",
        name: "Casa da Prefeitura",
        street: "Rua dos Servicos",
        vibe: "Porta de entrada para Prefeitura, Ouvidoria, E-SIC e servicos municipais de Cidade Piloto.",
        badge: "oficial",
        offer: "Acesso rapido a servicos municipais",
        products: ["prefeitura", "ouvidoria", "e-sic", "servicos municipais"],
        verification: "oficial",
        address: "Av. Presidente Castelo Branco, 5100, Centro, Cidade Piloto/CE",
      },
      {
        slug: "saude-horizonte",
        name: "Saude Cidade Piloto",
        street: "Rua dos Servicos",
        vibe: "Secretaria de Saude, UPA, hospital e caminhos de atendimento publico organizados num mesmo lugar.",
        badge: "oficial",
        offer: "Informacoes de saude e atendimento",
        products: ["secretaria de saude", "upa", "hospital municipal", "ubs"],
        verification: "oficial",
        address: "Av. Presidente Castelo Branco, 3600, Centro, Cidade Piloto/CE",
        contact: "(85) 3222-0520",
      },
      {
        slug: "demutran-horizonte",
        name: "DEMUTRAN Cidade Piloto",
        street: "Rua dos Servicos",
        vibe: "Atalhos de transito, atendimento e formularios publicos para quem quer resolver rapido.",
        badge: "oficial",
        offer: "Servicos de transito e formularios",
        products: ["demutran", "transito", "formularios", "servicos publicos"],
        verification: "oficial",
        address: "Cidade Piloto/CE",
      },
      {
        slug: "art-ton-papelaria",
        name: "Art & Ton Papelaria",
        street: "Rua dos Servicos",
        vibe: "Loja real de papelaria em Cidade Piloto, boa para testar comecio local com fonte publica verificavel.",
        badge: "mais verificavel",
        offer: "Kit escolar essencial por R$ 94,90",
        products: ["papelaria", "caderno", "kit escolar", "livraria"],
        verification: "mais verificavel",
        address: "Av. Presidente Castelo Branco, 4554, Centro, Cidade Piloto/CE",
        sourceLabel: "Diario Cidade",
        sourceUrl: "https://www.diariocidade.com/ce/horizonte/guia/art-ton-livraria-e-grafica-03496998000155/amp/",
      },
    ],
  },
  {
    slug: "grandes-promocoes",
    type: "vitrines",
    title: "Vitrine de Grandes Promocoes",
    subtitle: "Ofertas chamativas, quedas fortes e vitrines em destaque",
    count: "41 lojinhas",
    intro:
      "Aqui entram as vitrines que chegam fazendo barulho: quedas mais fortes, descontos chamativos e ofertas que puxam o olhar.",
    highlight: "Avenida para quem quer ir direto no que esta fervendo",
    pulse: "Desconto forte, giro rapido e muita curiosidade",
    shops: [
      {
        slug: "farmacia-caminho-popular",
        name: "Farmacia Caminho Popular",
        street: "Avenida Grandes Promocoes",
        vibe: "Farmacia real encontrada no eixo Castelo Branco, boa para testar vitrines locais do dia a dia.",
        badge: "mais verificavel",
        offer: "Vitamina C 1g por R$ 39,90",
        products: ["farmacia", "vitamina c", "medicamento", "perfumaria"],
        verification: "mais verificavel",
        address: "Av. Presidente Castelo Branco, 5437, Centro, Piloto/CE",
        sourceLabel: "Diario Cidade",
        sourceUrl: "https://www.diariocidade.com/ce/horizonte/guia/farmacia-caminho-popular-41123351000177/",
      },
      {
        name: "Ofertao Mix",
        street: "Avenida Grandes Promocoes",
        vibe: "Um pouco de tudo, com foco em desconto alto",
        badge: "bombando agora",
        offer: "Liquidificador por R$ 99",
        products: ["liquidificador", "ventilador", "caixa termica"],
      },
    ],
  },
] as const;

export const cityRoutes = [
  {
    name: "Avenida dos 30%+",
    label: "movimento alto",
    detail: "Descontos mais agressivos do dia",
    accent: "bg-[var(--pp-orange)]",
    width: "w-[70%]",
  },
  {
    name: "Travessa do Menor Preco",
    label: "rota rapida",
    detail: "Onde o preco puxou la pra baixo",
    accent: "bg-[var(--pp-blue)]",
    width: "w-[58%]",
  },
  {
    name: "Galeria das Lojinhas",
    label: "para explorar",
    detail: "Pequenas vitrines que merecem visita",
    accent: "bg-[var(--pp-blue-soft)]",
    width: "w-[82%]",
  },
] as const;

export const missions = [
  "Visite 3 ruas e salve suas vitrines favoritas.",
  "Abra 1 oferta da Avenida Grandes Promocoes.",
  "Compare 5 precos antes de decidir.",
] as const;

export const testShops: TestShop[] = [
  {
    name: "Passo Leve",
    street: "Rua dos Calcados",
    vibe: "Tenis, sandalias e achados para o dia a dia",
    badge: "vitrine aberta",
    offer: "Sandalia rasteira por R$ 79",
  },
  {
    name: "Casa Bonita",
    street: "Rua da Casa",
    vibe: "Utilidades, pequenos moveis e promos da semana",
    badge: "2 promos novas",
    offer: "Air fryer por R$ 289",
  },
  {
    name: "Papel & Cor",
    street: "Galeria das Lojinhas",
    vibe: "Papelaria, mochilas e lembrancas escolares",
    badge: "favorita da rua",
    offer: "Kit cadernos por R$ 49",
  },
  {
    name: "Brilho Nosso",
    street: "Avenida Grandes Promocoes",
    vibe: "Beleza, autocuidado e vitrines relampago",
    badge: "queda forte",
    offer: "Perfume por R$ 119",
  },
];

export function getDistrict(type: DistrictType, slug: string) {
  return districts.find((district) => district.type === type && district.slug === slug);
}

export function getDistrictsByType(type: DistrictType) {
  return districts.filter((district) => district.type === type);
}

export function getTestShopBySlug(slug: string) {
  for (const district of districts) {
    const shop = district.shops.find((item) => item.slug === slug);

    if (shop) {
      return {
        district,
        shop,
      };
    }
  }

  return undefined;
}
