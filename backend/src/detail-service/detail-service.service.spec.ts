import { Test, TestingModule } from '@nestjs/testing';
import { DetailServiceService } from './detail-service.service';

describe('DetailServiceService', () => {
  let service: DetailServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailServiceService],
    }).compile();

    service = module.get<DetailServiceService>(DetailServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
