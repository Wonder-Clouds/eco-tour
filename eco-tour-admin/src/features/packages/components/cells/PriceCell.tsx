interface Props {
  price: string
}

export const PriceCell = ({ price }: Props) => {
  const formattedPrice = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(parseFloat(price))

  return (
    <span className="font-medium" style={{ color: '#085f24' }}>
      {formattedPrice}
    </span>
  )
}
