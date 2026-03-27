export type PricePoint = {
  date: string;
  price: number;
};

export type DiscountAssessment = {
  status: "verified" | "recent-low" | "insufficient";
  label: string;
  shortLabel: string;
  detail: string;
  percentage?: number;
};

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function assessVerifiedDiscount(history: PricePoint[]): DiscountAssessment {
  if (history.length < 3) {
    return {
      status: "insufficient",
      label: "Historico insuficiente",
      shortLabel: "Em observacao",
      detail: "Ainda faltam dados desta loja para confirmar uma queda real.",
    };
  }

  const orderedHistory = [...history].sort((left, right) => left.date.localeCompare(right.date));
  const current = orderedHistory.at(-1);

  if (!current) {
    return {
      status: "insufficient",
      label: "Historico insuficiente",
      shortLabel: "Em observacao",
      detail: "Ainda faltam dados desta loja para confirmar uma queda real.",
    };
  }

  const previousWindow = orderedHistory.slice(0, -1);
  const previousPrices = previousWindow.map((entry) => entry.price);
  const recentAverage = average(previousPrices);
  const highestRecentPrice = Math.max(...previousPrices);
  const lowestRecentPrice = Math.min(...previousPrices);
  const dropFromAverage = ((recentAverage - current.price) / recentAverage) * 100;

  if (current.price < lowestRecentPrice && dropFromAverage >= 12) {
    return {
      status: "verified",
      label: "Desconto verificado",
      shortLabel: "Queda real",
      detail: `${Math.round(dropFromAverage)}% abaixo do preco recente desta loja.`,
      percentage: Math.round(dropFromAverage),
    };
  }

  if (current.price < highestRecentPrice && dropFromAverage >= 4) {
    return {
      status: "recent-low",
      label: "Bom preco recente",
      shortLabel: "Preco recente",
      detail: "Ha um bom preco hoje, mas sem evidencias fortes de queda estrutural.",
      percentage: Math.round(dropFromAverage),
    };
  }

  return {
    status: "insufficient",
    label: "Historico insuficiente",
    shortLabel: "Em observacao",
    detail: "Nao ha queda consistente suficiente para chamar de desconto verificado.",
  };
}
