import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditedFeeComponent } from './expedited-fee.component';

describe('ExpeditedFeeComponent', () => {
  let component: ExpeditedFeeComponent;
  let fixture: ComponentFixture<ExpeditedFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpeditedFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpeditedFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
