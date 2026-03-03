import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Plus, Trash2, Edit2, Check, Tag as TagIcon } from 'lucide-react'
import { useTags, useTagMutations } from '../hooks/useTags'
import { Tag } from '@/types/service.type'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const TagsManagerModal = ({ isOpen, onClose }: Props) => {
  const { data: tags = [], isLoading } = useTags()
  const { createTag, updateTag, deleteTag } = useTagMutations()

  const [newTagName, setNewTagName] = useState('')
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const handleCreateTag = () => {
    if (!newTagName.trim()) return
    createTag.mutate(newTagName, {
      onSuccess: () => setNewTagName(''),
    })
  }

  const handleUpdateTag = () => {
    if (!editingTag || !editingTag.name.trim()) return
    updateTag.mutate(
      { id: editingTag.id, name: editingTag.name },
      { onSuccess: () => setEditingTag(null) }
    )
  }

  const handleDeleteTag = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar la etiqueta "${name}"? Se eliminará de todos los servicios.`)) {
      deleteTag.mutate(id)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingTag) {
        handleUpdateTag()
      } else {
        handleCreateTag()
      }
    }
  }

  if (!isOpen) return null
  if (typeof document === 'undefined') return null

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#085f24' }}>
            <TagIcon size={24} />
            Gestionar Etiquetas
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Crear nueva etiqueta */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Etiqueta
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nombre de la etiqueta"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleCreateTag}
                disabled={createTag.isPending || !newTagName.trim()}
                className="px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: '#00bf35', color: '#ffffff' }}
              >
                <Plus size={18} />
                {createTag.isPending ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>

          {/* Lista de etiquetas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas Existentes ({tags.length})
            </label>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Cargando...</div>
            ) : tags.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No hay etiquetas creadas
              </div>
            ) : (
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    {editingTag?.id === tag.id ? (
                      <>
                        <input
                          type="text"
                          value={editingTag.name}
                          onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                          onKeyDown={handleKeyDown}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                          autoFocus
                        />
                        <button
                          onClick={handleUpdateTag}
                          disabled={updateTag.isPending}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => setEditingTag(null)}
                          className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span
                          className="flex-1 px-3 py-1 rounded-full text-sm font-medium inline-block"
                          style={{ backgroundColor: '#edfff2', color: '#00932c' }}
                        >
                          {tag.name}
                        </span>
                        <button
                          onClick={() => setEditingTag(tag)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTag(tag.id, tag.name)}
                          disabled={deleteTag.isPending}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
