# Documento de Estrutura do Ecossistema PesquisaPromo

## Visao Geral

O `PesquisaPromo` esta sendo construido como um ecossistema digital com identidade propria.

O conceito central nao e apenas o de um comparador de precos, mas o de uma **cidade virtual de ofertas**, com:

- ruas
- avenidas
- travessas
- galerias
- lojinhas
- vitrines
- exploracao
- atalho de navegacao
- laboratorio de testes

Essa cidade combina:

- descoberta ludica
- utilidade real
- busca objetiva
- comparacao de preco
- possibilidade futura de promocao verificada

---

## Estrutura Atual do Projeto Principal

```text
pesquisapromo/
├─ app/
│  ├─ page.tsx
│  ├─ layout.tsx
│  ├─ globals.css
│  ├─ ruas/
│  │  └─ [slug]/
│  │     ├─ page.tsx
│  │     └─ loading.tsx
│  ├─ avenidas/
│  │  └─ [slug]/
│  │     ├─ page.tsx
│  │     └─ loading.tsx
│  └─ lojas/
│     └─ [slug]/
│        └─ page.tsx
│
├─ lib/
│  └─ exploration-data.ts
│
├─ public/
│
└─ pesquisapromo-teste/
   ├─ app/
   ├─ package.json
   ├─ tsconfig.json
   ├─ next.config.ts
   ├─ postcss.config.mjs
   ├─ next-env.d.ts
   └─ README.md
```

---

## O Que Ja Existe no Site Principal

### 1. Home como portal da cidade

Arquivo principal:

- `app/page.tsx`

Funcoes atuais:

- portal de entrada da cidade
- busca principal
- bloco de `Taxi Virtual` em teste
- apresentacao do conceito de ruas e avenidas
- cards de navegacao para ruas reais
- mapa conceitual de exploracao
- camada de gamificacao leve
- vitrine de promocoes
- acesso ao laboratorio conceitual

---

### 2. Ruas dinamicas

Arquivo:

- `app/ruas/[slug]/page.tsx`

Funcoes atuais:

- paginas reais de ruas
- placa fixa no topo
- experiencia de caminhada
- lojas simuladas nos dois lados
- botao de retorno no fim da rua

Exemplos atuais:

- `Rua dos Calcados`
- `Rua da Casa`
- `Rua dos Testes`
- `Rua dos Servicos`

---

### 3. Avenidas dinamicas

Arquivo:

- `app/avenidas/[slug]/page.tsx`

Exemplo atual:

- `Avenida Grandes Promocoes`

Papel:

- ruas com maior destaque ou comportamento especial
- espacos de ofertas mais fortes ou movimentos tematicos

---

### 4. Lojinhas dinamicas

Arquivo:

- `app/lojas/[slug]/page.tsx`

Estado atual:

- ja existe a `Lojinha Alfa`
- funciona como terceira camada da navegacao
- serve como laboratorio de interface e experiencia
- contem ensaios de:
  - card de oferta
  - CTA
  - mini gamificacao
  - simulacao da futura Rua dos Brinquedos

---

### 5. Base simulada da cidade

Arquivo:

- `lib/exploration-data.ts`

Contem:

- ruas
- avenidas
- lojas
- produtos simulados
- ofertas
- dados do laboratorio
- base usada pelo autocomplete do Taxi Virtual

---

## Conceitos Ja Registrados no Produto

### Cidade virtual

O site e pensado como uma cidade navegavel, e nao como um marketplace generico.

### Ruas como paginas reais

Cada rua pode representar:

- categoria
- tema
- experiencia
- conjunto de lojinhas

### Lojinhas como paginas reais

Cada lojinha pode combinar:

- identidade propria
- parte ludica
- parte pratica
- oferta e contato

### Taxi Virtual

Ja existe em forma de teste na home.

Objetivo futuro:

- permitir ir direto para rua, loja, produto ou endereco simbolico
- equilibrar exploracao livre com navegacao objetiva

### Desconto verificado

Conceito central do produto:

- promocao nao deve ser validada apenas por comparacao com mercado
- o foco futuro e observar o historico da propria loja
- o objetivo e separar promocao real de falsa promocao

### Gamificacao leve

Conceitos em andamento:

- exploracao
- progresso
- missoes
- favoritos
- eggs
- mini joguinhos em ruas especificas

### Rua dos Brinquedos

Ja existe em simulacao conceitual dentro do laboratorio.

Ideias relacionadas:

- mini jogos gratis
- vitrine mais colorida
- recompensas leves
- surpresa sem perder utilidade

### Rua dos Servicos

Ja registrada como conceito e como rua simulada.

Objetivo:

- utilidades
- cidadania
- links oficiais
- ferramentas gratuitas
- apoio confiavel ao usuario

---

## Rua dos Testes

A `Rua dos Testes` existe para permitir experimentos sem baguncar as ruas principais.

Objetivo:

- testar layouts
- testar navegacao
- testar lojinhas
- testar gamificacao
- testar linguagem visual
- validar ideias antes de levar para o resto da cidade

Exemplo atual:

- `Lojinha Alfa`

---

## Segundo Site do Ecossistema

Como foi decidido, o proximo grande conjunto de testes **nao sera apenas uma rota interna**.

Ele sera tratado como **um segundo site**, dentro do mesmo repositorio.

Pasta criada:

- `pesquisapromo-teste/`

Objetivo:

- prototipos grandes
- segunda versao de cidade
- novas direcoes visuais
- testes amplos sem interferir no site principal

### Estrutura atual do segundo site

```text
pesquisapromo-teste/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ next-env.d.ts
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ README.md
└─ tsconfig.json
```

### Porta sugerida

- site principal: `localhost:3000`
- segundo site: `localhost:3001`

### Papel do segundo site

Usar esse espaco quando a ideia:

- for praticamente um novo site
- pedir outra experiencia
- envolver testes maiores
- merecer autonomia

Nao usar esse espaco quando a ideia:

- ainda fizer parte claramente da cidade principal
- puder ser testada em `Rua dos Testes`
- for so um ajuste pequeno

---

## Resumo Estrategico

### Site principal

Usar para:

- evolucao oficial da cidade
- ruas, avenidas e lojas do conceito principal
- experiencia que ja representa o produto

### Rua dos Testes

Usar para:

- experimentos internos da cidade
- prototipos locais
- ensaios de lojas e componentes

### Segundo site

Usar para:

- testes praticamente independentes
- versoes paralelas
- mudancas grandes de linguagem, arquitetura ou proposta

---

## Proximo Norte Recomendado

### No site principal

- consolidar a cidade
- amadurecer o Taxi Virtual
- expandir mais algumas ruas
- aprofundar a logica de loja e oferta

### No segundo site

- testar uma nova versao de entrada
- testar uma nova cidade
- testar narrativa e estrutura mais ousadas

---

## Frases-Chave do Projeto

- `Lojas virtuais, promocoes reais`
- cidade virtual de ofertas
- ruas e lojinhas como experiencia central
- exploracao com utilidade
- desconto verificado como diferencial

---

## Encerramento

Este documento serve como guia de orientacao para qualquer pessoa que entrar no projeto e precise entender:

- o que o PesquisaPromo ja tem
- o que esta sendo construindo
- como o ecossistema esta dividido
- onde cada tipo de teste deve acontecer

Documento gerado para acompanhamento do projeto e alinhamento de estrutura.
