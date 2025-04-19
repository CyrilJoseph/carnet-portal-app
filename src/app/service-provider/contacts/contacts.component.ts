import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { NotificationService } from '../../core/services/notification.service';
import { Contact } from '../../core/models/service-provider/contact';
import { PhonePipe } from '../../shared/pipes/phone.pipe';
import { CommonModule } from '@angular/common';
import { CustomPaginator } from '../../shared/custom-paginator';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contacts',
  imports: [AngularMaterialModule, ReactiveFormsModule, PhonePipe, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }],
})
export class ContactsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['firstName', 'lastName', 'title', 'phone', 'email', 'defaultContact', 'actions'];
  dataSource = new MatTableDataSource<any>();
  contactForm: FormGroup;
  isEditing = false;
  currentContactId: number | null = null;
  isLoading = false;
  showForm = false;

  @Input() spid: number = 0;
  @Output() hasContacts = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      middleInitial: ['', [Validators.maxLength(1)]],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      mobile: ['', [Validators.pattern(/^[0-9]{10,15}$/)]],
      fax: ['', [Validators.pattern(/^[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      defaultContact: [false]
    });
  }

  ngOnInit(): void {
    this.loadContacts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadContacts(): void {
    this.isLoading = true;

    this.contactService.getContactsById(this.spid).subscribe({
      next: (contacts: Contact[]) => {
        this.dataSource.data = contacts;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load contacts');
        this.isLoading = false;
        console.error('Error loading contacts:', error);
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

  addNewContact(): void {
    this.showForm = true;
    this.isEditing = false;
    this.currentContactId = null;
    this.contactForm.reset();
   // this.contactForm.patchValue({ defaultContact: false });
  }

  editContact(contact: Contact): void {
    this.showForm = true;
    this.isEditing = true;
    this.currentContactId = contact.spContactId;
    this.contactForm.patchValue({
      firstName: contact.firstName,
      lastName: contact.lastName,
      middleInitial: contact.middleInitial,
      title: contact.title,
      phone: contact.phone,
      mobile: contact.mobile,
      fax: contact.fax,
      email: contact.email,
    //  defaultContact: contact.defaultContact
    });
  }

  saveContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const contactData = this.contactForm.value;
    const saveObservable = this.isEditing && (this.currentContactId! > 0)
      ? this.contactService.updateContact(this.currentContactId!, contactData)
      : this.contactService.createContact(this.spid, contactData);

    saveObservable.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Contact ${this.isEditing ? 'updated' : 'added'} successfully`);
        this.loadContacts();
        this.cancelEdit();
        this.hasContacts.emit(true);
      },
      error: (error) => {
        this.notificationService.showError(`Failed to ${this.isEditing ? 'update' : 'add'} contact`);
        console.error('Error saving contact:', error);
      }
    });
  }

  deleteContact(contactId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this contact?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.deleteContact(contactId).subscribe({
          next: () => {
            this.notificationService.showSuccess('Contact deleted successfully');
            this.loadContacts();
          },
          error: (error) => {
            this.notificationService.showError('Failed to delete contact');
            console.error('Error deleting contact:', error);
          }
        });
      }
    });
  }

  cancelEdit(): void {
    this.showForm = false;
    this.isEditing = false;
    this.currentContactId = null;
    this.contactForm.reset();
  }

  // setDefaultContact(contactId: string): void {
  //   this.contactService.setDefaultServiceProviderContact(this.spid, contactId).subscribe({
  //     next: () => {
  //       this.notificationService.showSuccess('Default contact updated successfully');
  //       this.loadContacts();
  //     },
  //     error: (error) => {
  //       this.notificationService.showError('Failed to set default contact');
  //       console.error('Error setting default contact:', error);
  //     }
  //   });
  // }
}