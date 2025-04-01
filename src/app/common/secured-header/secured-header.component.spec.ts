import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuredHeaderComponent } from './secured-header.component';

describe('SecuredHeaderComponent', () => {
  let component: SecuredHeaderComponent;
  let fixture: ComponentFixture<SecuredHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuredHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecuredHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
