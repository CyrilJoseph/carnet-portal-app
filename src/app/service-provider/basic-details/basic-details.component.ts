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
import { ServiceProviderService } from '../../core/services/service-provider.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-basic-details',
  imports: [AngularMaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss']
})
export class BasicDetailsComponent implements OnInit, OnDestroy {
  @Input() isEditMode = false;
  @Input() spid: number = 0;

 // @Output() formReady = new EventEmitter<FormGroup>();
 // @Output() validityChange = new EventEmitter<boolean>();
 // @Output() valueChange = new EventEmitter<BasicDetail>();

  basicDetailsForm: FormGroup;
  countries: Country[] = [];
  regions: Region[] = [];
  states: State[] = [];
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private serviceProviderService: ServiceProviderService,
    private notificationService: NotificationService
  ) {
    this.basicDetailsForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadLookupData();

    // Emit the form when it's ready
   // this.formReady.emit(this.basicDetailsForm);

    // Listen for validity changes
    // this.basicDetailsForm.statusChanges
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     this.validityChange.emit(this.basicDetailsForm.valid);
    //   });

    // Listen for value changes
    // this.basicDetailsForm.valueChanges
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(values => {
    //     if (this.basicDetailsForm.valid) {
    //       this.valueChange.emit(this.prepareOutputData(values));
    //     }
    //   });

    // Patch edit form data
    if (this.spid > 0) {
      this.serviceProviderService.getBasicDetailsById(this.spid).subscribe({
        next: (basicDetail: BasicDetail) => {
          if (basicDetail?.spid > 0) {
            this.patchFormData(basicDetail);
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to load contacts');
          this.isLoading = false;
          console.error('Error loading contacts:', error);
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
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}(?:[-\s]\d{4})?$/)]],
      issuingRegion: ['', Validators.required],
      replacementRegion: ['', Validators.required]
    });
  }

  loadLookupData(): void {
    this.commonService.getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (countries) => {
          this.countries = countries;
          this.loadRegions();
        },
        error: (error) => {
          console.error('Failed to load countries', error);
          this.isLoading = false;
        }
      });
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
    this.commonService.getStates(country)
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
  }

  onCountryChange(country: string): void {
    this.basicDetailsForm.get('state')?.reset();

    if (country) {
      this.loadStates(country);
      this.basicDetailsForm.get('state')?.enable();
    } else {
      this.basicDetailsForm.get('state')?.disable();
    }
  }

  // prepareOutputData(formValues: any): BasicDetail {
  //   return {
  //     companyName: formValues.companyName,
  //     lookupCode: formValues.lookupCode,
  //     address1: formValues.address1,
  //     address2: formValues.address2,
  //     city: formValues.city,
  //     country: formValues.country,
  //     state: formValues.state,
  //     zip: formValues.zip,
  //     issuingRegion: formValues.issuingRegion,
  //     replacementRegion: formValues.replacementRegion,
  //     spid: this.spid
  //   };
  // }

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
      ? this.serviceProviderService.updateBasicDetails(this.spid, basicDetailData)
      : this.serviceProviderService.createBasicDetails(basicDetailData);

    saveObservable.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Basic details ${this.isEditMode ? 'updated' : 'added'} successfully`);
      },
      error: (error) => {
        this.notificationService.showError(`Failed to ${this.isEditMode ? 'update' : 'add'} basic details`);
        console.error('Error saving contact:', error);
      }
    });
  }
}