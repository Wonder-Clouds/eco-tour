import { Test, TestingModule } from '@nestjs/testing';
import { DetailServiceController } from './detail-service.controller';
import { DetailServiceService } from './detail-service.service';

describe('DetailServiceController', () => {
  let controller: DetailServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailServiceController],
      providers: [DetailServiceService],
    }).compile();

    controller = module.get<DetailServiceController>(DetailServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
