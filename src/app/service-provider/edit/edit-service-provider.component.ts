import { Component, viewChild } from '@angular/core';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { MatAccordion } from '@angular/material/expansion';
import { BasicDetailsComponent } from '../basic-details/basic-details.component';
import { ContactsComponent } from '../contacts/contacts.component';

@Component({
  selector: 'app-edit-service-provider',
  imports: [AngularMaterialModule, BasicDetailsComponent, ContactsComponent],
  templateUrl: './edit-service-provider.component.html',
  styleUrl: './edit-service-provider.component.scss'
})
export class EditServiceProviderComponent {
  accordion = viewChild.required(MatAccordion);
  isEditMode = true;
  spid = 22;
}
