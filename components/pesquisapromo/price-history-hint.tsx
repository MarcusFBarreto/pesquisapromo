type Props = {
  recentAveragePrice: number | null;
  evidenceCount: number;
};

export function PriceHistoryHint({ recentAveragePrice, evidenceCount }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-600">
      <p className="font-medium text-slate-800">Baseado no histórico desta loja</p>
      <p>
        {recentAveragePrice
          ? `Preço médio recente: R$ ${recentAveragePrice.toFixed(2)}`
          : "Ainda há pouco histórico para uma leitura forte."}
      </p>
      <p className="text-xs text-slate-500">Amostras consideradas: {evidenceCount}</p>
    </div>
  );
}
