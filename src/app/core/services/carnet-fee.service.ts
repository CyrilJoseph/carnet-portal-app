import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CarnetFee } from '../models/service-provider/carnet-fee';

@Injectable({
  providedIn: 'root'
})
export class CarnetFeeService {
  private apiUrl = environment.apiUrl;
  private apiDb = environment.apiDb;

  constructor(private http: HttpClient, private userService: UserService) { }

  getFeeCommissions(spid: number): Observable<CarnetFee[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetFeeComm?P_SPID=${spid}&P_ACTIVE_INACTIVE=ACTIVE`).pipe(
      map(response => this.mapToFeeCommissions(response)));
  }

  private mapToFeeCommissions(data: any[]): CarnetFee[] {
    return data.map(item => ({
      feeCommissionId: item.FEECOMMID,
      feeType: item.FEETYPEID,
      description: item.DESCRIPTION,
      commissionRate: item.COMMRATE,
      effectiveDate: item.EFFDATE,
      spid: item.SPID
    }));
  }

  createFeeCommission(spid: number, data: CarnetFee): Observable<any> {
    const feeCommission = {
      P_SPID: spid,
      P_PARAMID: data.feeType,
      //P_DESCRIPTION: data.description,
      P_COMMRATE: data.commissionRate,
      P_EFFDATE: data.effectiveDate,
      P_USERID: this.userService.getUser()
    };

    return this.http.post<any>(`${this.apiUrl}/${this.apiDb}/CreateFeeComm`, feeCommission);
  }

  updateFeeCommission(id: number, data: CarnetFee): Observable<any> {
    const feeCommission = {
      P_FEECOMMID: id,
      P_RATE: data.commissionRate,
      P_EFFDATE: data.effectiveDate,
      P_USERID: this.userService.getUser()
    };

    return this.http.patch<any>(`${this.apiUrl}/${this.apiDb}/UpdateFeeComm`, feeCommission);
  }

  // deleteFeeCommission(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${this.apiDb}/DeleteFeeCommission/${id}`);
  // }
}
