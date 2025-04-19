import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { BasicDetail } from '../models/service-provider/basic-detail';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../models/service-provider/contact';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';
import { CarnetSequence } from '../models/service-provider/carnet-sequence';
import { CounterfoilFee } from '../models/service-provider/counterfoil-fee';
import { ContinuationSheetFee } from '../models/service-provider/continuation-sheet-fee';
import { ExpeditedFee } from '../models/service-provider/expedited-fee';
import { SecurityDeposit } from '../models/service-provider/security-deposit';

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {
  private apiUrl = environment.apiUrl;
  private apiDb = environment.apiDb;

  constructor(private http: HttpClient, private userService: UserService) { }

}
