import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../core/services/notification.service';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { CommonModule } from '@angular/common';
import { ServiceProviderService } from '../../core/services/service-provider.service';
import { CounterfoilFee } from '../../core/models/service-provider/counterfoil-fee';
import { CustomPaginator } from '../../shared/custom-paginator';

@Component({
  selector: 'app-counterfoil-fee',
  imports: [AngularMaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './counterfoil-fee.component.html',
  styleUrl: './counterfoil-fee.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }],
})
export class CounterfoilFeeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['customerType', 'carnetType', 'startSets', 'endSets', 'rate', 'effectiveDate', 'actions'];
  dataSource = new MatTableDataSource<any>();
  counterfoilForm: FormGroup;
  isEditing = false;
  currentCounterfoilId: number | null = null;
  isLoading = false;
  showForm = false;

  // Dropdown options
  customerTypes = [
    { label: 'Preparer', value: 'PREPARER' },
    { label: 'Self Issuer', value: 'SELFISSUER' }
  ];

  carnetTypes = [
    { label: 'Original', value: 'ORIGINAL' },
    { label: 'Re-order', value: 'REORDER' },
    { label: 'Replacement', value: 'REPLACE' }
  ];

  @Input() isEditMode = false;
  @Input() spid: number = 0;
  @Output() hasCounterFoilFee = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private serviceProviderService: ServiceProviderService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.counterfoilForm = this.fb.group({
      customerType: ['', Validators.required],
      carnetType: ['', Validators.required],
      startSets: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(1)
      ]],
      endSets: ['', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(1)
      ]],
      rate: ['', [
        Validators.required,
        Validators.pattern(/^\d+\.?\d{0,2}$/),
        Validators.min(0)
      ]],
      effectiveDate: ['', Validators.required]
    }, { validator: this.validateSetsRange });
  }

  ngOnInit(): void {
    this.loadCounterfoils();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private validateSetsRange(group: FormGroup): { [key: string]: any } | null {
    const start = +group.get('startSets')?.value;
    const end = +group.get('endSets')?.value;
    return start && end && start >= end ? { invalidRange: true } : null;
  }

  loadCounterfoils(): void {
    if (!this.spid) return;

    this.isLoading = true;
    this.serviceProviderService.getCounterfoils(this.spid)
      .subscribe({
        next: (
          counterfoils: CounterfoilFee[]) => {
          this.dataSource.data = counterfoils;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to load counterfoils');
          this.isLoading = false;
          console.error('Error loading counterfoils:', error);
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

  addNewCounterfoil(): void {
    this.showForm = true;
    this.isEditing = false;
    this.currentCounterfoilId = null;
    this.counterfoilForm.reset();
  }

  editCounterfoil(counterfoil: any): void {
    this.showForm = true;
    this.isEditing = true;
    this.currentCounterfoilId = counterfoil.id;
    this.counterfoilForm.patchValue({
      customerType: counterfoil.customerType,
      carnetType: counterfoil.carnetType,
      startSets: counterfoil.startSets,
      endSets: counterfoil.endSets,
      rate: counterfoil.rate,
      effectiveDate: new Date(counterfoil.effectiveDate)
    });
  }

  saveCounterfoil(): void {
    if (this.counterfoilForm.invalid) {
      this.counterfoilForm.markAllAsTouched();
      return;
    }

    const counterfoilData = {
      ...this.counterfoilForm.value,
      spid: this.spid,
      effectiveDate: this.counterfoilForm.value.effectiveDate.toISOString()
    };

    const saveObservable = this.isEditing && this.currentCounterfoilId
      ? this.serviceProviderService.updateCounterfoil(this.currentCounterfoilId, counterfoilData)
      : this.serviceProviderService.addCounterfoil(this.spid, counterfoilData);

    saveObservable.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Counterfoil ${this.isEditing ? 'updated' : 'added'} successfully`);
        this.loadCounterfoils();
        this.cancelEdit();
        this.hasCounterFoilFee.emit(true);
      },
      error: (error) => {
        this.notificationService.showError(`Failed to ${this.isEditing ? 'update' : 'add'} counterfoil`);
        console.error('Error saving counterfoil:', error);
      }
    });
  }

  // deleteCounterfoil(counterfoilId: string): void {
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     width: '350px',
  //     data: {
  //       title: 'Confirm Delete',
  //       message: 'Are you sure you want to delete this counterfoil setup?',
  //       confirmText: 'Delete',
  //       cancelText: 'Cancel'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.serviceProviderService.deleteCounterfoil(counterfoilId).subscribe({
  //         next: () => {
  //           this.notificationService.showSuccess('Counterfoil deleted successfully');
  //           this.loadCounterfoils();
  //         },
  //         error: (error) => {
  //           this.notificationService.showError('Failed to delete counterfoil');
  //         }
  //       });
  //     }
  //   });
  // }

  cancelEdit(): void {
    this.showForm = false;
    this.isEditing = false;
    this.currentCounterfoilId = null;
    this.counterfoilForm.reset();
  }

  getOptionLabel(options: any[], value: string): string {
    return options.find(opt => opt.value === value)?.label || value;
  }
}