import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsecuredHeaderComponent } from './unsecured-header.component';

describe('UnsecuredHeaderComponent', () => {
  let component: UnsecuredHeaderComponent;
  let fixture: ComponentFixture<UnsecuredHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsecuredHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsecuredHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
