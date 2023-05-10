import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderrorComponent } from './loaderror.component';

describe('LoaderrorComponent', () => {
  let component: LoaderrorComponent;
  let fixture: ComponentFixture<LoaderrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
