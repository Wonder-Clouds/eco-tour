import { SummaryPerson } from '../../api/personsApi'

interface Props {
  person: SummaryPerson
}

export const AvatarCell = ({ person }: Props) => {
  const initials = `${person.first_name.charAt(0)}${person.last_name.charAt(0)}`.toUpperCase()

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
        style={{ backgroundColor: '#00bf35' }}
      >
        {initials}
      </div>
      <span className="font-medium text-black">
        {person.first_name} {person.last_name}
      </span>
    </div>
  )
}
