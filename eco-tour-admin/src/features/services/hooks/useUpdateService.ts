import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  updateService,
  deleteService,
  addItinerary,
  updateItinerary,
  deleteItinerary,
  addData,
  updateData,
  deleteData,
  uploadImage,
  uploadCover,
  setCover,
  deleteMedia,
  updateMedia,
  UpdateServiceBasicData,
  ItineraryInput,
  DataInput,
  UploadImageInput,
} from '../api/servicesApi'

export function useUpdateService(serviceId: string) {
  const queryClient = useQueryClient()

  const invalidateService = () => {
    queryClient.invalidateQueries({ queryKey: ['service', serviceId] })
    queryClient.invalidateQueries({ queryKey: ['services'] })
  }

  // Actualizar datos básicos del servicio
  const updateBasicMutation = useMutation({
    mutationFn: (data: UpdateServiceBasicData) => updateService(serviceId, data),
    onSuccess: invalidateService,
  })

  // Eliminar servicio
  const deleteMutation = useMutation({
    mutationFn: () => deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })

  // Itinerario
  const addItineraryMutation = useMutation({
    mutationFn: (data: ItineraryInput) => addItinerary(serviceId, data),
    onSuccess: invalidateService,
  })

  const updateItineraryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItineraryInput> }) =>
      updateItinerary(id, data),
    onSuccess: invalidateService,
  })

  const deleteItineraryMutation = useMutation({
    mutationFn: (id: string) => deleteItinerary(id),
    onSuccess: invalidateService,
  })

  // Data
  const addDataMutation = useMutation({
    mutationFn: (data: DataInput) => addData(serviceId, data),
    onSuccess: invalidateService,
  })

  const updateDataMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DataInput> }) =>
      updateData(id, data),
    onSuccess: invalidateService,
  })

  const deleteDataMutation = useMutation({
    mutationFn: (id: string) => deleteData(id),
    onSuccess: invalidateService,
  })

  // Media
  const uploadImageMutation = useMutation({
    mutationFn: (data: UploadImageInput) => uploadImage(serviceId, data),
    onSuccess: invalidateService,
  })

  const uploadCoverMutation = useMutation({
    mutationFn: (data: UploadImageInput) => uploadCover(serviceId, data),
    onSuccess: invalidateService,
  })

  const setCoverMutation = useMutation({
    mutationFn: (mediaId: string) => setCover(serviceId, mediaId),
    onSuccess: invalidateService,
  })

  const deleteMediaMutation = useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: invalidateService,
  })

  const updateMediaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; description?: string } }) =>
      updateMedia(id, data),
    onSuccess: invalidateService,
  })

  return {
    // Basic
    updateBasic: updateBasicMutation,
    deleteService: deleteMutation,
    // Itinerary
    addItinerary: addItineraryMutation,
    updateItinerary: updateItineraryMutation,
    deleteItinerary: deleteItineraryMutation,
    // Data
    addData: addDataMutation,
    updateData: updateDataMutation,
    deleteData: deleteDataMutation,
    // Media
    uploadImage: uploadImageMutation,
    uploadCover: uploadCoverMutation,
    setCover: setCoverMutation,
    deleteMedia: deleteMediaMutation,
    updateMedia: updateMediaMutation,
  }
}
