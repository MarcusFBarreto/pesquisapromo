export type DistrictType = "ruas" | "avenidas";

export type TestShop = {
  slug?: string;
  name: string;
  street: string;
  vibe: string;
  badge: string;
  offer: string;
  products?: string[];
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
    item: "Smart TV 50 polegadas",
    store: "Parceiro Centro",
    price: "R$ 2.199",
    note: "caiu de verdade nas ultimas semanas",
  },
  {
    item: "Geladeira frost free",
    store: "Loja Zona Sul",
    price: "R$ 3.489",
    note: "menor valor visto neste mes",
  },
  {
    item: "Kit material escolar",
    store: "Papelaria Horizonte",
    price: "R$ 189",
    note: "oferta local com poucas unidades",
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
    type: "ruas",
    title: "Rua dos Calcados",
    subtitle: "Tenis, sandalias, chinelos e vitrines para toda a familia",
    count: "38 lojinhas",
    intro:
      "Uma rua para quem gosta de bater perna atras de tenis, sandalia, sapato e achados que resolvem o dia a dia.",
    highlight: "Vitrines mais visitadas da semana",
    pulse: "Movimento bom e oferta aparecendo toda hora",
    shops: [
      {
        name: "Passo Leve",
        street: "Rua dos Calcados",
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
    type: "ruas",
    title: "Rua da Casa",
    subtitle: "Moveis, eletros, reforma e achados para o lar",
    count: "52 lojinhas",
    intro:
      "Uma rua para olhar com calma e ir montando a casa aos poucos, sem perder uma boa oportunidade.",
    highlight: "Achados para cozinha, sala e cantinhos da casa",
    pulse: "Sempre tem alguma vitrine chamando atencao",
    shops: [
      {
        name: "Casa Bonita",
        street: "Rua da Casa",
        vibe: "Utilidades, pequenos moveis e promos da semana",
        badge: "2 promos novas",
        offer: "Air fryer por R$ 289",
        products: ["air fryer", "cafeteira", "escorredor de pratos"],
      },
      {
        name: "Lar em Festa",
        street: "Rua da Casa",
        vibe: "Decoracao, organizacao e pequenos desejos para o lar",
        badge: "queridinha da rua",
        offer: "Jogo de panelas por R$ 199",
        products: ["jogo de panelas", "air fryer", "conjunto de copos"],
      },
      {
        name: "Cantinho Bom",
        street: "Rua da Casa",
        vibe: "Banheiro, lavanderia e itens uteis para todo dia",
        badge: "preco amigo",
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
    type: "ruas",
    title: "Rua dos Testes",
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
    type: "ruas",
    title: "Rua dos Servicos",
    subtitle: "Atalhos confiaveis para utilidades, cidadania e links oficiais",
    count: "8 portas uteis",
    intro:
      "Uma rua pensada para reunir servicos publicos, utilidades gratuitas e atalhos confiaveis do dia a dia, sempre com clareza e sem misturar com vitrines comerciais.",
    highlight: "Um canto da cidade voltado para resolver e facilitar",
    pulse: "Mais calma, mais objetiva e com cara de servico que ajuda",
    shops: [
      {
        name: "Casa do gov.br",
        street: "Rua dos Servicos",
        vibe: "Entrada para servicos digitais, identidade e atalhos oficiais",
        badge: "link util",
        offer: "Acesso rapido a servicos publicos",
        products: ["servico digital", "gov.br", "atalho oficial"],
      },
      {
        name: "Janela da Cidadania",
        street: "Rua dos Servicos",
        vibe: "Um espaco para juntar documentos, consultas e orientacoes",
        badge: "consulta facil",
        offer: "Servicos do dia a dia em um so caminho",
        products: ["documentos", "consulta cpf", "segunda via"],
      },
      {
        name: "Praca das Utilidades",
        street: "Rua dos Servicos",
        vibe: "Calculadoras, simuladores e ferramentas gratuitas",
        badge: "gratis",
        offer: "Ferramentas praticas para usar sem complicacao",
        products: ["calculadora", "simulador", "ferramenta gratuita"],
      },
      {
        name: "Guia do Procon",
        street: "Rua dos Servicos",
        vibe: "Direitos do consumidor, alertas e atalhos de apoio",
        badge: "orientacao",
        offer: "Informacao para comprar com mais seguranca",
        products: ["procon", "direito do consumidor", "orientacao"],
      },
    ],
  },
  {
    slug: "grandes-promocoes",
    type: "avenidas",
    title: "Avenida Grandes Promocoes",
    subtitle: "Ofertas chamativas, quedas fortes e vitrines em destaque",
    count: "41 lojinhas",
    intro:
      "Aqui entram as vitrines que chegam fazendo barulho: quedas mais fortes, descontos chamativos e ofertas que puxam o olhar.",
    highlight: "Avenida para quem quer ir direto no que esta fervendo",
    pulse: "Desconto forte, giro rapido e muita curiosidade",
    shops: [
      {
        name: "Brilho Nosso",
        street: "Avenida Grandes Promocoes",
        vibe: "Beleza, autocuidado e vitrines relampago",
        badge: "queda forte",
        offer: "Perfume por R$ 119",
        products: ["perfume", "hidratante", "kit beleza"],
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
