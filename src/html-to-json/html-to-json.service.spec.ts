import { Test, TestingModule } from '@nestjs/testing';
import { HtmlToJsonService } from './html-to-json.service';

describe('HtmlToJsonService', () => {
  let service: HtmlToJsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HtmlToJsonService],
    }).compile();

    service = module.get<HtmlToJsonService>(HtmlToJsonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
