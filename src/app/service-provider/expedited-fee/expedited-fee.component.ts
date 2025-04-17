import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { NotificationService } from '../../core/services/notification.service';
import { ServiceProviderService } from '../../core/services/service-provider.service';
import { CommonModule } from '@angular/common';
import { CustomPaginator } from '../../shared/custom-paginator';
import { ExpeditedFee } from '../../core/models/service-provider/expedited-fee';
import { DeliveryType } from '../../core/models/delivery-type';
import { TimeZone } from '../../core/models/TimeZone';
import { CommonService } from '../../core/services/common.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-expedited-fee',
  imports: [AngularMaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './expedited-fee.component.html',
  styleUrl: './expedited-fee.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }],
})
export class ExpeditedFeeComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['customerType', 'deliveryType', 'time', 'timeZone', 'fee', 'effectiveDate', 'actions'];
  dataSource = new MatTableDataSource<any>();
  feeForm: FormGroup;
  isEditing = false;
  currentFeeId: number | null = null;
  isLoading = false;
  showForm = false;

  private destroy$ = new Subject<void>();

  @Input() isEditMode = false;
  @Input() spid: number = 0;
  @Output() hasExpeditedFees = new EventEmitter<boolean>();

  customerTypes = [
    { value: 'PREPARER', label: 'Preparer' },
    { value: 'SELFISSUER', label: 'Self issuer' }
  ];

  deliveryTypes: DeliveryType[] = [];
  timeZones: TimeZone[] = [];

  constructor(
    private fb: FormBuilder,
    private serviceProviderService: ServiceProviderService,
    private notificationService: NotificationService,
    private commonService: CommonService,
    private dialog: MatDialog
  ) {
    this.feeForm = this.fb.group({
      customerType: ['', Validators.required],
      deliveryType: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      timeZone: ['', Validators.required],
      fee: [0, [Validators.required, Validators.min(0)]],
      effectiveDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadExpeditedFees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadExpeditedFees(): void {
    this.isLoading = true;

    // Replace with actual API call
    this.serviceProviderService.getExpeditedFees(this.spid).subscribe({
      next: (fees: ExpeditedFee[]) => {
        this.dataSource.data = fees;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load expedited fees');
        this.isLoading = false;
        console.error('Error loading expedited fees:', error);
      }
    });
  }

  loadLookupData(): void {
    this.loadDeliveryTypes();
    this.loadTimeZones();
  }

  loadTimeZones(): void {
    this.commonService.getTimezones()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (timeZones) => {
          this.timeZones = timeZones;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load time zones', error);
          this.isLoading = false;
        }
      });
  }

  loadDeliveryTypes(): void {
    this.commonService.getDeliveryTypes(this.spid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (deliveryTypes) => {
          this.deliveryTypes = deliveryTypes;
        },
        error: (error) => {
          console.error('Failed to load delivery types', error);
          this.isLoading = false;
        }
      });
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addNewFee(): void {
    this.showForm = true;
    this.isEditing = false;
    this.currentFeeId = null;
    this.feeForm.reset();
    this.feeForm.patchValue({ fee: 0 });
  }

  editFee(fee: ExpeditedFee): void {
    this.showForm = true;
    this.isEditing = true;
    this.currentFeeId = fee.expeditedFeeId;
    this.feeForm.patchValue({
      customerType: fee.customerType,
      deliveryType: fee.deliveryType,
      startTime: fee.startTime,
      endTime: fee.endTime,
      timeZone: fee.timeZone,
      fee: fee.fee,
      effectiveDate: fee.effectiveDate
    });
  }

  saveFee(): void {
    if (this.feeForm.invalid) {
      this.feeForm.markAllAsTouched();
      return;
    }

    const feeData = this.feeForm.value;
    const saveObservable = this.isEditing && this.currentFeeId
      ? this.serviceProviderService.updateExpeditedFee(this.currentFeeId, feeData)
      : this.serviceProviderService.createExpeditedFee(this.spid, feeData);

    saveObservable.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Expedited fee ${this.isEditing ? 'updated' : 'added'} successfully`);
        this.loadExpeditedFees();
        this.cancelEdit();
      },
      error: (error) => {
        this.notificationService.showError(`Failed to ${this.isEditing ? 'update' : 'add'} expedited fee`);
        console.error('Error saving expedited fee:', error);
      }
    });
  }

  // deleteFee(feeId: string): void {
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     width: '350px',
  //     data: {
  //       title: 'Confirm Delete',
  //       message: 'Are you sure you want to delete this expedited fee?',
  //       confirmText: 'Delete',
  //       cancelText: 'Cancel'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.serviceProviderService.deleteExpeditedFee(feeId).subscribe({
  //         next: () => {
  //           this.notificationService.showSuccess('Expedited fee deleted successfully');
  //           this.loadExpeditedFees();
  //         },
  //         error: (error) => {
  //           this.notificationService.showError('Failed to delete expedited fee');
  //           console.error('Error deleting expedited fee:', error);
  //         }
  //       });
  //     }
  //   });
  // }

  cancelEdit(): void {
    this.showForm = false;
    this.isEditing = false;
    this.currentFeeId = null;
    this.feeForm.reset();
  }

  getCustomerTypeLabel(value: string): string {
    const type = this.customerTypes.find(t => t.value === value);
    return type ? type.label : value;
  }
}