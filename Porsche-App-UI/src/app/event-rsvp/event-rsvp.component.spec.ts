import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRsvpComponent } from './event-rsvp.component';

describe('EventListComponent', () => {
  let component: EventRsvpComponent;
  let fixture: ComponentFixture<EventRsvpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRsvpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventRsvpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
