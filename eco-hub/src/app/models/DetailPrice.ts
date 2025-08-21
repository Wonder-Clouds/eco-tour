export type Coin = 'USD' | 'PEN';

export interface DetailPrice {
  coin: Coin;
  finalPrice: number;
}
