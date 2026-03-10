import { TestBed } from '@angular/core/testing';

import { MockSocketService } from './mock-socket-service';

describe('MockSocketService', () => {
  let service: MockSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
