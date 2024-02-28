import { TestBed } from '@angular/core/testing';

import { FetchlistdataService } from './fetchlistdata.service';

describe('FetchlistdataService', () => {
  let service: FetchlistdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchlistdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
