// src/features/services/components/cells/PriceCell.tsx
interface Props {
  price: string;
}

export const PriceCell = ({ price }: Props) => {
  const formatted = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(parseFloat(price));

  return <span className="font-semibold">{formatted}</span>;
};