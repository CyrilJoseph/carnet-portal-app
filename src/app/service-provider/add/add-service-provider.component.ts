import { Component } from '@angular/core';
import { BasicDetailsComponent } from '../basic-details/basic-details.component';

@Component({
  selector: 'app-add-service-provider',
  imports: [BasicDetailsComponent],
  templateUrl: './add-service-provider.component.html',
  styleUrl: './add-service-provider.component.scss'
})
export class AddServiceProviderComponent {
  isEditMode = false;
}
