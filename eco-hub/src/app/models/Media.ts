export type MediaType = 'IMAGE' | 'PDF' | 'POST';

export interface Media {
  id: number;
  type: MediaType;
  url: string;
  image: string;
  isCover: boolean;
}
