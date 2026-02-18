// src/features/services/components/cells/PriceCell.tsx
interface Props {
  price: string;
}

export const PriceCell = ({ price }: Props) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(price));

  return <span className="font-semibold" style={{ color: '#000000' }}>{formatted}</span>;
};