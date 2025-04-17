import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFeeComponent } from './basic-fee.component';

describe('BasicFeeComponent', () => {
  let component: BasicFeeComponent;
  let fixture: ComponentFixture<BasicFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
