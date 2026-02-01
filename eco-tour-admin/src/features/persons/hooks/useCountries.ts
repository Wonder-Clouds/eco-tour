import { useQuery } from '@tanstack/react-query'
import { getCountries, Country } from '../api/personsApi'

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
    staleTime: 30 * 60 * 1000, // 30 minutes - countries don't change often
  })
}

// Helper function para obtener el nombre del país por su código
export const getCountryLabel = (countries: Country[] | undefined, code: string): string => {
  if (!countries || !code) return code || '-'
  const country = countries.find(c => c.value === code)
  return country?.label || code
}
