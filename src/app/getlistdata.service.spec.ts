import { TestBed } from '@angular/core/testing';

import { GetlistdataService } from './getlistdata.service';

describe('GetlistdataService', () => {
  let service: GetlistdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetlistdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
