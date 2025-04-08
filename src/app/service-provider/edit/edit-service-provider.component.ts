import { Component, viewChild } from '@angular/core';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { MatAccordion } from '@angular/material/expansion';
import { BasicDetailsComponent } from '../basic-details/basic-details.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { ActivatedRoute } from '@angular/router';
import { CarnetSequenceComponent } from '../carnet-sequence/carnet-sequence.component';

@Component({
  selector: 'app-edit-service-provider',
  imports: [AngularMaterialModule, BasicDetailsComponent, ContactsComponent, CarnetSequenceComponent],
  templateUrl: './edit-service-provider.component.html',
  styleUrl: './edit-service-provider.component.scss'
})
export class EditServiceProviderComponent {
  accordion = viewChild.required(MatAccordion);
  isEditMode = true;
  spid = 0;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.spid = idParam ? parseInt(idParam, 10) : 0;
  }
}
