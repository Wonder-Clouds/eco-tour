import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  updatePackage,
  deletePackage,
  addServiceToPackage,
  removeServiceFromPackage,
  updateServicesOrder,
  UpdatePackageInput,
  CreatePackageServiceInput,
} from '../api/packagesApi'

export function useUpdatePackage(packageId: string) {
  const queryClient = useQueryClient()

  const invalidatePackage = () => {
    queryClient.invalidateQueries({ queryKey: ['package', packageId] })
    queryClient.invalidateQueries({ queryKey: ['packages'] })
  }

  // Actualizar datos básicos del paquete
  const updateBasicMutation = useMutation({
    mutationFn: (data: UpdatePackageInput) => updatePackage(packageId, data),
    onSuccess: invalidatePackage,
  })

  // Eliminar paquete
  const deleteMutation = useMutation({
    mutationFn: () => deletePackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
  })

  // Agregar servicio al paquete
  const addServiceMutation = useMutation({
    mutationFn: (data: CreatePackageServiceInput) => addServiceToPackage(packageId, data),
    onSuccess: invalidatePackage,
  })

  // Eliminar servicio del paquete
  const removeServiceMutation = useMutation({
    mutationFn: (serviceId: string) => removeServiceFromPackage(packageId, serviceId),
    onSuccess: invalidatePackage,
  })

  // Actualizar orden de servicios
  const updateOrderMutation = useMutation({
    mutationFn: (services: CreatePackageServiceInput[]) => updateServicesOrder(packageId, services),
    onSuccess: invalidatePackage,
  })

  return {
    updateBasic: updateBasicMutation,
    deletePackage: deleteMutation,
    addService: addServiceMutation,
    removeService: removeServiceMutation,
    updateOrder: updateOrderMutation,
  }
}
