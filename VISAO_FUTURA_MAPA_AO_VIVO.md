# Visão Futura: Mapa ao Vivo — PesquisaPromo

> Documento registrado em 28/03/2026 para preservar a ideia até o momento certo de implementação.

## Conceito

Quando o PesquisaPromo tiver volume de parceiros e dados reais de preço, implementar um **mapa interativo estilo Waze** onde:

- Sinais de "queima de preço" pipocam no mapa em tempo real
- Super ofertas reais aparecem geolocalizadas
- O usuário vê a cidade e descobre oportunidades por proximidade
- A metáfora de ruas, avenidas e lojinhas ganha vida como camada visual sobre o mapa

## Pré-requisitos para viabilizar
1. Base sólida de parceiros reais publicando preços
2. Histórico de preço real para calcular quedas verificadas
3. Volume mínimo de ofertas para o mapa não parecer vazio
4. Integração com geolocalização (Leaflet/Mapbox)

## Código existente que pode ser reaproveitado
- `lib/pesquisapromo-verified-discount.ts` — lógica de queda real de preço
- `lib/pesquisapromo-city-data.ts` — estrutura de dados de ruas/lojas/ofertas
- `components/pesquisapromo/map-board-leaflet.tsx` — componente de mapa (já existe em stash)
- `lib/exploration-data.ts` — districts, shops, routes

## Referência visual
- Waze com pins pulsando em lojas com promoções ativas
- Cores: laranja para queimas fortes, teal para ofertas normais
- Filtro por categoria/rua/tipo de produto

> **Guardar até ter 20+ parceiros ativos e dados reais fluindo.**
