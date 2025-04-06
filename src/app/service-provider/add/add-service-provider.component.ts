import { Component } from '@angular/core';
import { BasicDetailsComponent } from '../basic-details/basic-details.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from '../contacts/contacts.component';

@Component({
  selector: 'app-add-service-provider',
  imports: [BasicDetailsComponent, AngularMaterialModule, CommonModule, ContactsComponent],
  templateUrl: './add-service-provider.component.html',
  styleUrl: './add-service-provider.component.scss'
})
export class AddServiceProviderComponent {
  isEditMode = false;
  serviceProviderId: number | null = null;
  currentStep: number = 0;
  isLoading: boolean = false;

  basicDetailsCompleted: boolean = false;
  contactsCompleted: boolean = false;

  onBasicDetailsSaved(event: string): void {
    this.serviceProviderId = +event;
    this.basicDetailsCompleted = true;
    this.currentStep = 1; // Move to next step
  }

  onStepChange(event: StepperSelectionEvent): void {
    this.currentStep = event.selectedIndex;
  }
}
