import { TestBed } from '@angular/core/testing';

import { DynamicformsstoringService } from './dynamicformsstoring.service';

describe('DynamicformsstoringService', () => {
  let service: DynamicformsstoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicformsstoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
