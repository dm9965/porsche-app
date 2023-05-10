import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsvpTotalsComponent } from './rsvp-totals.component';

describe('RsvpTotalsComponent', () => {
  let component: RsvpTotalsComponent;
  let fixture: ComponentFixture<RsvpTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsvpTotalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsvpTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
