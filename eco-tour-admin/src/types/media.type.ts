export interface Media {
  id: string
  title: string
  description: string
  type_media: string
  file: string
  url?: string | null
  is_cover: boolean
  created_at?: string
  updated_at?: string
}
