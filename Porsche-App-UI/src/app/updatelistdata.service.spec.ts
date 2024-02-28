import { TestBed } from '@angular/core/testing';

import { UpdatelistdataService } from './updatelistdata.service';

describe('UpdatelistdataService', () => {
  let service: UpdatelistdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdatelistdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
