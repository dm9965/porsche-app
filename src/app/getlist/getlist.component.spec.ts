import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetlistComponent } from './getlist.component';

describe('GetlistComponent', () => {
  let component: GetlistComponent;
  let fixture: ComponentFixture<GetlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
