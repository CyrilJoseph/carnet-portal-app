import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinuationSheetFeeComponent } from './continuation-sheet-fee.component';

describe('ContinuationSheetFeeComponent', () => {
  let component: ContinuationSheetFeeComponent;
  let fixture: ComponentFixture<ContinuationSheetFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContinuationSheetFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContinuationSheetFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
