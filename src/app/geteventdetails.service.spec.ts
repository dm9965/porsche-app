import { TestBed } from '@angular/core/testing';

import { GeteventdetailsService } from './geteventdetails.service';

describe('GeteventdetailsService', () => {
  let service: GeteventdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeteventdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
