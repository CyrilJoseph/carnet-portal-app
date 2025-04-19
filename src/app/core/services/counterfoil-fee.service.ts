import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { CounterfoilFee } from '../models/service-provider/counterfoil-fee';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CounterfoilFeeService {
  private apiUrl = environment.apiUrl;
  private apiDb = environment.apiDb;

  constructor(private http: HttpClient, private userService: UserService) { }

  getCounterfoils(spid: number): Observable<CounterfoilFee[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetCfFeeRates?p_spid=${spid}`).pipe(
      map(response => this.mapToCounterFoilFee(response)));
  }

  private mapToCounterFoilFee(data: any[]): CounterfoilFee[] {
    return data.map(item => ({
      id: item.P_CFFEESETUPID,
      spid: item.SPID,
      startSets: item.STARTSETS,
      endSets: item.ENDSETS,
      customerType: item.CUSTOMERTYPE,
      carnetType: item.CARNETTYPE,
      effectiveDate: item.EFFDATE,
      rate: item.RATE,
    }));
  }

  addCounterfoil(spid: number, data: CounterfoilFee): Observable<any> {

    const counterfoilFee = {
      P_SPID: spid,
      P_STARTSETS: data.startSets,
      P_ENDSETS: data.endSets,
      P_EFFDATE: data.effectiveDate,
      P_CUSTOMERTYPE: data.customerType,
      P_CARNETTYPE: data.carnetType,
      P_RATE: data.rate,
      P_USERID: this.userService.getUser()
    }

    return this.http.post<any>(`${this.apiUrl}/${this.apiDb}/CreateCfFee`, counterfoilFee);
  }

  updateCounterfoil(id: number, data: CounterfoilFee): Observable<any> {

    const counterfoilFee = {
      P_CFFEESETUPID: id,
      P_EFFDATE: data.effectiveDate,
      P_RATE: data.rate,
      P_USERID: this.userService.getUser()
    }

    return this.http.patch<any>(`${this.apiUrl}/${this.apiDb}//UpdateCfFee`, counterfoilFee);
  }

  // deleteCounterfoil(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${this.apiDb}/InactivateSPContact/${id}`);
  // }

}
