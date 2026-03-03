import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useUpdatePerson } from '../hooks/useUpdatePerson'
import { useCountries } from '../hooks/useCountries'
import { UpdatePersonData } from '../api/personsApi'
import { Person } from '@/types/person.type'

interface Props {
  isOpen: boolean
  onClose: () => void
  person: Person
}

export const EditPersonModal = ({ isOpen, onClose, person }: Props) => {
  const { mutate: updatePerson, isPending } = useUpdatePerson()
  const { data: countries } = useCountries()

  const [formData, setFormData] = useState<UpdatePersonData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    passport_number: '',
    birth_date: '',
    nationality: '',
    is_generic: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof UpdatePersonData, string>>>({})

  useEffect(() => {
    if (person) {
      setFormData({
        first_name: person.first_name || '',
        last_name: person.last_name || '',
        email: person.email || '',
        phone_number: person.phone_number || '',
        passport_number: person.passport_number || '',
        birth_date: person.birth_date || '',
        nationality: person.nationality || '',
        is_generic: person.is_generic || false,
      })
    }
  }, [person])

  const handleChange = (field: keyof UpdatePersonData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UpdatePersonData, string>> = {}
    if (!formData.first_name?.trim()) newErrors.first_name = 'El nombre es requerido'
    if (!formData.last_name?.trim()) newErrors.last_name = 'El apellido es requerido'
    if (!formData.email?.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    // Only send fields that have values (PATCH only needs changed fields)
    const dataToSend: UpdatePersonData = {}
    if (formData.first_name?.trim()) dataToSend.first_name = formData.first_name.trim()
    if (formData.last_name?.trim()) dataToSend.last_name = formData.last_name.trim()
    if (formData.email?.trim()) dataToSend.email = formData.email.trim()
    if (formData.phone_number?.trim()) dataToSend.phone_number = formData.phone_number.trim()
    if (formData.passport_number?.trim()) dataToSend.passport_number = formData.passport_number.trim()
    if (formData.birth_date?.trim()) dataToSend.birth_date = formData.birth_date.trim()
    if (formData.nationality?.trim()) dataToSend.nationality = formData.nationality.trim()
    // Always include is_generic since it's a boolean
    dataToSend.is_generic = formData.is_generic

    updatePerson(
      { id: person.id, data: dataToSend },
      {
        onSuccess: () => onClose(),
        onError: (error) => {
          console.error('Error updating person:', error)
          alert('Error al actualizar el cliente')
        },
      }
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: '#085f24' }}>Editar Cliente</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input type="text" value={formData.first_name} onChange={(e) => handleChange('first_name', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500 ${errors.first_name ? 'border-red-500' : ''}`} placeholder="Nombre" />
              {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
              <input type="text" value={formData.last_name} onChange={(e) => handleChange('last_name', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500 ${errors.last_name ? 'border-red-500' : ''}`} placeholder="Apellido" />
              {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500 ${errors.email ? 'border-red-500' : ''}`} placeholder="email@ejemplo.com" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="tel" value={formData.phone_number} onChange={(e) => handleChange('phone_number', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500" placeholder="+51 999 999 999" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Pasaporte</label>
              <input type="text" value={formData.passport_number} onChange={(e) => handleChange('passport_number', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500" placeholder="A12345678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input type="date" value={formData.birth_date} onChange={(e) => handleChange('birth_date', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad</label>
              <select value={formData.nationality} onChange={(e) => handleChange('nationality', e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500">
                <option value="">Seleccionar país</option>
                {countries?.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.is_generic}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_generic: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Cliente Temporal</p>
                  <p className="text-sm text-gray-500">Marcar si es un pasajero temporal o placeholder</p>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSubmit} disabled={isPending} className="px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50" style={{ backgroundColor: '#00bf35' }}>{isPending ? 'Guardando...' : 'Guardar Cambios'}</button>
        </div>
      </div>
    </div>
  )
}
