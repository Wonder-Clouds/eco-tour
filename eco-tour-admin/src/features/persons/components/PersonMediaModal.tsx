import { useState } from 'react'
import { X, Upload, FileText, Image, Edit2, Trash2 } from 'lucide-react'
import { uploadPersonDocument, uploadPersonImage, deleteMedia, updateMedia } from '../api/personsApi'
import { useQueryClient } from '@tanstack/react-query'
import { Media } from '@/types/media.type'

interface Props {
  isOpen: boolean
  onClose: () => void
  personId: string
  existingMedia?: Media[]
}

type MediaType = 'image' | 'document'

export const PersonMediaModal = ({ isOpen, onClose, personId, existingMedia = [] }: Props) => {
  const queryClient = useQueryClient()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadType, setUploadType] = useState<MediaType>('image')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Estado para editar media
  const [editingMedia, setEditingMedia] = useState<Media | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)

      // Preview para imágenes
      if (uploadType === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Selecciona un archivo')
      return
    }
    if (!title.trim()) {
      setError('El título es requerido')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        file: selectedFile,
      }

      if (uploadType === 'image') {
        await uploadPersonImage(personId, data)
      } else {
        await uploadPersonDocument(personId, data)
      }

      // Limpiar formulario
      setTitle('')
      setDescription('')
      setSelectedFile(null)
      setPreview(null)

      // Refrescar datos
      queryClient.invalidateQueries({ queryKey: ['person', personId] })
      queryClient.invalidateQueries({ queryKey: ['persons'] })

      alert('Archivo subido correctamente')
    } catch (err) {
      console.error('Error al subir archivo:', err)
      setError('Error al subir el archivo. Inténtalo de nuevo.')
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setSelectedFile(null)
    setPreview(null)
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    setEditingMedia(null)
    onClose()
  }

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('¿Estás seguro de eliminar este archivo? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await deleteMedia(mediaId)
      queryClient.invalidateQueries({ queryKey: ['person', personId] })
      queryClient.invalidateQueries({ queryKey: ['persons'] })
      alert('Archivo eliminado correctamente')
    } catch (err) {
      console.error('Error al eliminar archivo:', err)
      alert('Error al eliminar el archivo')
    }
  }

  const handleEditMedia = (media: Media) => {
    setEditingMedia(media)
    setEditTitle(media.title)
    setEditDescription(media.description || '')
  }

  const handleSaveEdit = async () => {
    if (!editingMedia) return

    if (!editTitle.trim()) {
      alert('El título es requerido')
      return
    }

    try {
      await updateMedia(editingMedia.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      })

      queryClient.invalidateQueries({ queryKey: ['person', personId] })
      queryClient.invalidateQueries({ queryKey: ['persons'] })
      setEditingMedia(null)
      alert('Archivo actualizado correctamente')
    } catch (err) {
      console.error('Error al actualizar archivo:', err)
      alert('Error al actualizar el archivo')
    }
  }

  const handleCancelEdit = () => {
    setEditingMedia(null)
    setEditTitle('')
    setEditDescription('')
  }

  if (!isOpen) return null

  const images = existingMedia.filter(m => m.type_media === 'image')
  const documents = existingMedia.filter(m => m.type_media === 'document')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold" style={{ color: '#085f24' }}>
            Gestionar Archivos del Cliente
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Sección de subida */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#085f24' }}>
              Subir nuevo archivo
            </h3>

            {/* Selector de tipo */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => { setUploadType('image'); resetForm(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                  uploadType === 'image'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <Image size={20} />
                Imagen
              </button>
              <button
                onClick={() => { setUploadType('document'); resetForm(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                  uploadType === 'document'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <FileText size={20} />
                Documento
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500"
                  placeholder={uploadType === 'image' ? 'Ej: Foto de pasaporte' : 'Ej: Copia de pasaporte'}
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500"
                  placeholder="Descripción opcional del archivo"
                />
              </div>

              {/* Selector de archivo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Archivo *
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition">
                      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-sm text-gray-600">
                        {selectedFile ? selectedFile.name : 'Haz clic para seleccionar archivo'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {uploadType === 'image' ? 'JPG, PNG, GIF hasta 10MB' : 'PDF, DOC, DOCX hasta 10MB'}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept={uploadType === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
                      onChange={handleFileChange}
                    />
                  </label>

                  {/* Preview de imagen */}
                  {preview && uploadType === 'image' && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            {/* Botón de subida */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition disabled:opacity-50"
                style={{ backgroundColor: '#00bf35' }}
              >
                <Upload size={18} />
                {isUploading ? 'Subiendo...' : 'Subir archivo'}
              </button>
            </div>
          </div>

          {/* Archivos existentes */}
          {existingMedia.length > 0 && (
            <>
              {/* Imágenes */}
              {images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#085f24' }}>
                    <Image size={20} />
                    Imágenes ({images.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((media) => (
                      <div key={media.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={media.file}
                            alt={media.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Botones de acción */}
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                handleEditMedia(media)
                              }}
                              className="p-2 bg-white rounded-lg shadow hover:bg-gray-100"
                              title="Editar"
                            >
                              <Edit2 size={16} style={{ color: '#f59e0b' }} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                handleDeleteMedia(media.id)
                              }}
                              className="p-2 bg-white rounded-lg shadow hover:bg-gray-100"
                              title="Eliminar"
                            >
                              <Trash2 size={16} style={{ color: '#dc2626' }} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium truncate">{media.title}</p>
                          {media.description && (
                            <p className="text-xs text-gray-500 truncate">{media.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documentos */}
              {documents.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#085f24' }}>
                    <FileText size={20} />
                    Documentos ({documents.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((media) => (
                      <div
                        key={media.id}
                        className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition group"
                      >
                        <FileText size={24} className="text-gray-600 flex-shrink-0" />
                        <a
                          href={media.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-0"
                        >
                          <p className="font-medium truncate">{media.title}</p>
                          {media.description && (
                            <p className="text-sm text-gray-500 truncate">{media.description}</p>
                          )}
                        </a>
                        {/* Botones de acción */}
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              handleEditMedia(media)
                            }}
                            className="p-2 rounded-lg hover:bg-gray-200 transition"
                            title="Editar"
                          >
                            <Edit2 size={16} style={{ color: '#f59e0b' }} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              handleDeleteMedia(media.id)
                            }}
                            className="p-2 rounded-lg hover:bg-gray-200 transition"
                            title="Eliminar"
                          >
                            <Trash2 size={16} style={{ color: '#dc2626' }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {existingMedia.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto mb-2 opacity-50" />
              <p>No hay archivos asociados a este cliente</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal de Edición */}
      {editingMedia && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleCancelEdit} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md m-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: '#085f24' }}>
                Editar Archivo
              </h3>
              <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500"
                  placeholder="Título del archivo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green-500"
                  placeholder="Descripción del archivo"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: '#00bf35' }}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
