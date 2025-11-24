export type MediaType = 'IMAGE' | 'PDF' | 'POST';

export interface Media {
  id: number;
  title: string;
  description: string;
  type_media: MediaType;
  file: string;
  url: string;
  image: string;
  is_cover: boolean;
}
