import { QuoteDetail } from './quote-detail';
import { ActivatedRoute } from '@angular/router';
describe('QuoteDetail', () => {
  it('should create', () => {
    const mockRoute = {} as ActivatedRoute;
    const mockQuoteApi = { getQuoteById: () => ({ subscribe: () => {} }) } as any;
    const mockGroupApi = { getGroups: () => ({ subscribe: () => {} }) } as any;
    expect(new QuoteDetail(mockRoute, mockQuoteApi, mockGroupApi)).toBeTruthy();
  });
});
