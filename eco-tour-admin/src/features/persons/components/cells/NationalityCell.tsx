import { Country } from '../../api/personsApi'
import { getCountryLabel } from '../../hooks/useCountries'

interface Props {
  code: string
  countries?: Country[]
}

export const NationalityCell = ({ code, countries }: Props) => {
  return (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
      {getCountryLabel(countries, code)}
    </span>
  )
}
