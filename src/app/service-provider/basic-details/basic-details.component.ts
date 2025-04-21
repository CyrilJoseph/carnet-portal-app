import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BasicDetail } from '../../core/models/service-provider/basic-detail';
import { Country } from '../../core/models/country';
import { Region } from '../../core/models/region';
import { State } from '../../core/models/state';
import { CommonService } from '../../core/services/common.service';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { ZipCodeValidator } from '../../shared/validators/zipcode-validator';
import { BasicDetailService } from '../../core/services/basic-detail.service';

@Component({
  selector: 'app-basic-details',
  imports: [AngularMaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss']
})
export class BasicDetailsComponent implements OnInit, OnDestroy {
  @Input() isEditMode = false;
  @Input() spid: number = 0;
  @Output() spidCreated = new EventEmitter<string>();

  basicDetailsForm: FormGroup;
  countries: Country[] = [];
  regions: Region[] = [];
  states: State[] = [];
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private basicDetailService: BasicDetailService,
    private notificationService: NotificationService
  ) {
    this.basicDetailsForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadLookupData();

    // Patch edit form data
    if (this.spid > 0) {
      this.basicDetailService.getBasicDetailsById(this.spid).subscribe({
        next: (basicDetail: BasicDetail) => {
          if (basicDetail?.spid > 0) {
            this.patchFormData(basicDetail);
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to load basic details');
          this.isLoading = false;
          console.error('Error loading basic details:', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm(): FormGroup {
    return this.fb.group({
      companyName: ['', [Validators.required, Validators.maxLength(100)]],
      lookupCode: ['', [Validators.maxLength(20)]],
      address1: ['', [Validators.required, Validators.maxLength(100)]],
      address2: ['', [Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, ZipCodeValidator('country')]],
      issuingRegion: ['', Validators.required],
      replacementRegion: ['', Validators.required]
    });
  }

  loadLookupData(): void {
    this.commonService.getCountries(this.spid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (countries) => {
          this.countries = countries;
        },
        error: (error) => {
          console.error('Failed to load countries', error);
          this.isLoading = false;
        }
      });

    this.loadRegions();
  }

  loadRegions(): void {
    this.commonService.getRegions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (regions) => {
          this.regions = regions;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load regions', error);
          this.isLoading = false;
        }
      });
  }

  loadStates(country: string): void {
    this.isLoading = true;
    this.commonService.getStates(country, this.spid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (states) => {
          this.states = states;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load states', error);
          this.isLoading = false;
        }
      });
  }

  patchFormData(data: BasicDetail): void {
    this.basicDetailsForm.patchValue({
      companyName: data.companyName,
      lookupCode: data.lookupCode,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      country: data.country,
      state: data.state,
      zip: data.zip,
      issuingRegion: data.issuingRegion,
      replacementRegion: data.replacementRegion
    });

    if (data.country) {
      this.loadStates(data.country);
    }

    if (this.isEditMode) {
      this.basicDetailsForm.get('issuingRegion')?.disable();
      this.basicDetailsForm.get('replacementRegion')?.disable();
    }
  }

  onCountryChange(country: string): void {
    this.basicDetailsForm.get('state')?.reset();

    if (country) {
      this.loadStates(country);
      this.basicDetailsForm.get('state')?.enable();
    } else {
      this.basicDetailsForm.get('state')?.disable();
    }

    this.basicDetailsForm.get('zip')?.updateValueAndValidity();
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.basicDetailsForm.controls;
  }

  saveBasicDetails(): void {
    if (this.basicDetailsForm.invalid) {
      this.basicDetailsForm.markAllAsTouched();
      return;
    }

    const basicDetailData = this.basicDetailsForm.value;
    const saveObservable = this.isEditMode && this.spid > 0
      ? this.basicDetailService.updateBasicDetails(this.spid, basicDetailData)
      : this.basicDetailService.createBasicDetails(basicDetailData);

    saveObservable.subscribe({
      next: (basicData: any) => {
        this.notificationService.showSuccess(`Basic details ${this.isEditMode ? 'updated' : 'added'} successfully`);

        if (!this.isEditMode) {
          this.spidCreated.emit("24");//basicData.spid);
        }
      },
      error: (error) => {
        this.notificationService.showError(`Failed to ${this.isEditMode ? 'update' : 'add'} basic details`);
        console.error('Error saving contact:', error);
      }
    });
  }
}