import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePerson } from '../hooks/usePerson'
import { useCountries, getCountryLabel } from '../hooks/useCountries'
import { useGroups } from '@/features/groups/hooks/useGroups'
import { ArrowLeft, Mail, Phone, Calendar, Flag, FileText, User, Upload, Image, Edit3, Users } from 'lucide-react'
import { PersonMediaModal } from './PersonMediaModal'
import { EditPersonModal } from './EditPersonModal'

interface Props {
  personId: string
}

export const PersonDetailPage = ({ personId }: Props) => {
  const navigate = useNavigate()
  const { data: person, isLoading, error, refetch } = usePerson(personId)
  const { data: countries } = useCountries()
  const { data: allGroups } = useGroups()
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Get group details from person's group IDs
  const personGroups = allGroups?.filter(group =>
    person?.group?.includes(group.id)
  ) || []

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <p style={{ color: '#00932c' }}>Cargando cliente...</p>
      </div>
    )
  }

  if (error || !person) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
        <p className="text-red-600">Error al cargar el cliente</p>
      </div>
    )
  }

  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: '/persons' })}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#085f24' }}>
              {person.first_name} {person.last_name}
            </h1>
            <p className="text-gray-600">Detalle del cliente</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium border"
            style={{ borderColor: '#2563eb', color: '#2563eb' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <Edit3 size={20} />
            Editar
          </button>
          <button
            onClick={() => setIsMediaModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium"
            style={{ backgroundColor: '#00bf35', color: '#ffffff' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#00932c' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#00bf35' }}
          >
            <Upload size={20} />
            Gestionar Archivos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar y datos principales */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4"
              style={{ backgroundColor: '#00bf35' }}
            >
              {person.first_name.charAt(0)}{person.last_name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-center">
              {person.first_name} {person.last_name}
            </h2>
            {person.nationality && (
              <span className="mt-2 px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                {getCountryLabel(countries, person.nationality)}
              </span>
            )}
          </div>
        </div>

        {/* Información de contacto */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#085f24' }}>
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <Mail size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{person.email || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <Phone size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{person.phone_number || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <FileText size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pasaporte</p>
                <p className="font-medium">{person.passport_number || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <Calendar size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                <p className="font-medium">
                  {person.birth_date ? new Date(person.birth_date).toLocaleDateString('es-PE') : '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <Flag size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Nacionalidad</p>
                <p className="font-medium">{getCountryLabel(countries, person.nationality)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <User size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="font-medium">{person.is_generic ? 'Genérico' : 'Registrado'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Imágenes */}
        {person.media && person.media.filter(m => m.type_media === 'image').length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#085f24' }}>
              <Image size={20} />
              Imágenes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {person.media.filter(m => m.type_media === 'image').map((media) => (
                <a
                  key={media.id}
                  href={media.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-lg overflow-hidden border hover:shadow-lg transition"
                >
                  <img
                    src={media.file}
                    alt={media.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                    <div className="text-white">
                      <p className="text-sm font-medium truncate">{media.title}</p>
                      {media.description && (
                        <p className="text-xs opacity-80 truncate">{media.description}</p>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Documentos */}
        {person.media && person.media.filter(m => m.type_media === 'document').length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#085f24' }}>
              <FileText size={20} />
              Documentos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {person.media.filter(m => m.type_media === 'document').map((media) => (
                <a
                  key={media.id}
                  href={media.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <FileText size={24} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{media.title}</p>
                    {media.description && (
                      <p className="text-sm text-gray-500 truncate">{media.description}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Grupos */}
        {personGroups.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#085f24' }}>
              <Users size={20} />
              Grupos ({personGroups.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personGroups.map((group) => (
                <a
                  key={group.id}
                  href={`/groups/${group.id}`}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition hover:border-green-300"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: '#00932c' }}
                  >
                    <Users size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{group.name}</p>
                    <p className="text-sm text-gray-500">
                      {group.total_people} {group.total_people === 1 ? 'persona' : 'personas'}
                    </p>
                    {group.contact_info && (
                      <p className="text-xs text-gray-400 truncate">Contacto: {group.contact_info}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de gestión de archivos */}
      <PersonMediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        personId={personId}
        existingMedia={person.media}
      />

      {/* Modal de edición */}
      <EditPersonModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          refetch()
        }}
        person={person}
      />
    </div>
  )
}
