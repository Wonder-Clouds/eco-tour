import { useState } from 'react'
import { useGroups } from '../hooks/useGroups'
import { useDeleteGroup } from '../hooks/useGroupMutations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Users,
  Search,
  Plus,
  Loader2,
  AlertCircle,
  Trash2,
  Eye,
  User,
} from 'lucide-react'


export const GroupsListPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: groups = [], isLoading, error } = useGroups({ search: searchQuery })
  const deleteGroupMutation = useDeleteGroup()

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este grupo?')) return

    setDeletingId(id)
    try {
      await deleteGroupMutation.mutateAsync(id)
    } catch (err) {
      console.error('Error deleting group:', err)
      alert('Error al eliminar el grupo')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fafafa' }}>
        <Loader2 className="animate-spin mr-2" size={24} style={{ color: '#00932c' }} />
        <span style={{ color: '#00932c' }}>Cargando grupos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#fafafa' }}>
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-red-600 text-lg">Error al cargar los grupos</p>
      </div>
    )
  }

  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#085f24' }}>
            Grupos
          </h1>
          <p className="text-gray-500 mt-1">Gestiona los grupos de personas</p>
        </div>
        <a
          href="/groups/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white transition"
          style={{ backgroundColor: '#00bf35' }}
        >
          <Plus size={20} />
          Nuevo Grupo
        </a>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-md mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Buscar grupos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="border-0 shadow-md hover:shadow-lg transition">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg" style={{ color: '#085f24' }}>
                  <Users size={20} />
                  {group.name}
                </CardTitle>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#edfff2', color: '#00932c' }}
                >
                  {group.total_people} personas
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Contacto</p>
                <p className="font-medium">{group.contact_info || '-'}</p>
              </div>
              {group.description && (
                <div>
                  <p className="text-xs text-gray-500">Descripción</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{group.description}</p>
                </div>
              )}

              {/* Personas preview */}
              {group.person && group.person.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Personas</p>
                  <div className="flex flex-wrap gap-1">
                    {group.person.slice(0, 3).map((person) => (
                      <span
                        key={person.id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: '#f3f4f6' }}
                      >
                        <User size={12} />
                        {person.first_name} {person.last_name}
                      </span>
                    ))}
                    {group.person.length > 3 && (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                        +{group.person.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <a
                  href={`/groups/${group.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition hover:bg-gray-50"
                >
                  <Eye size={16} />
                  Ver Detalle
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(group.id)}
                  disabled={deletingId === group.id}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  {deletingId === group.id ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No hay grupos registrados</p>
          <a
            href="/groups/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#00bf35' }}
          >
            <Plus size={16} />
            Crear primer grupo
          </a>
        </div>
      )}
    </div>
  )
}

