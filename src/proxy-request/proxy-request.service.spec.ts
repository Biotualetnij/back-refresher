import { Test, TestingModule } from '@nestjs/testing';
import { ProxyRequestService } from './proxy-request.service';

describe('ProxyRequestService', () => {
  let service: ProxyRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProxyRequestService],
    }).compile();

    service = module.get<ProxyRequestService>(ProxyRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
