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
  addPriceRule,
  updatePriceRule,
  deletePriceRule,
  addPricingTier,
  updatePricingTier,
  deletePricingTier,
  addTagsToService,
  UpdateServiceBasicData,
  ItineraryInput,
  DataInput,
  UploadImageInput,
  PriceRuleInput,
  PricingTierInput,
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

  // Price Rules
  const addPriceRuleMutation = useMutation({
    mutationFn: (data: PriceRuleInput) => addPriceRule(serviceId, data),
    onSuccess: invalidateService,
  })

  const updatePriceRuleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PriceRuleInput> }) =>
      updatePriceRule(id, data),
    onSuccess: invalidateService,
  })

  const deletePriceRuleMutation = useMutation({
    mutationFn: (id: string) => deletePriceRule(id),
    onSuccess: invalidateService,
  })

  // Pricing Tiers
  const addPricingTierMutation = useMutation({
    mutationFn: (data: PricingTierInput) => addPricingTier(serviceId, data),
    onSuccess: invalidateService,
  })

  const updatePricingTierMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PricingTierInput> }) =>
      updatePricingTier(id, data),
    onSuccess: invalidateService,
  })

  const deletePricingTierMutation = useMutation({
    mutationFn: (id: string) => deletePricingTier(id),
    onSuccess: invalidateService,
  })

  // Tags
  const addTagsMutation = useMutation({
    mutationFn: (tagIds: string[]) => addTagsToService(serviceId, tagIds),
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
    // Price Rules
    addPriceRule: addPriceRuleMutation,
    updatePriceRule: updatePriceRuleMutation,
    deletePriceRule: deletePriceRuleMutation,
    // Pricing Tiers
    addPricingTier: addPricingTierMutation,
    updatePricingTier: updatePricingTierMutation,
    deletePricingTier: deletePricingTierMutation,
    // Tags
    addTags: addTagsMutation,
  }
}
