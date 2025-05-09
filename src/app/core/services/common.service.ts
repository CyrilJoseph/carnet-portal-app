import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Region } from '../models/region';
import { Country } from '../models/country';
import { State } from '../models/state';
import { environment } from '../../../environments/environment';
import { Commodity } from '../models/commodity';
import { DeliveryType } from '../models/delivery-type';
import { FeeType } from '../models/fee-type';
import { TimeZone } from '../models/timezone';
import { BondSurety } from '../models/bond-surety';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private apiUrl = environment.apiUrl;
  private apiDb = environment.apiDb;

  constructor(private http: HttpClient) { }

  getCountries(spid: number = 0): Observable<Country[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=002&P_SPID=0`).pipe(
      map((response) =>
        response.map((item) => ({
          name: item.PARAMDESC,
          id: item.PARAMID,
          value: item.PARAMVALUE
        }))
      )
    );
  }

  getStates(country: string, spid: number = 0): Observable<State[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=001&P_SPID=0`).pipe(
      map((response) =>
        response.map((item) => ({
          name: item.PARAMDESC,
          id: item.PARAMID,
          value: item.PARAMVALUE,
          countryValue: item.ADDLPARAMVALUE1,
        })).filter((state) => state.countryValue === country) // Filter by country value
      ),
      catchError((error) => {
        console.error('Error fetching states:', error);
        return of([]);
      })
    );
  }

  getRegions(): Observable<Region[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetRegions`).pipe(
      map((response) =>
        response.map((item) => ({
          id: item.REGIONID,
          region: item.REGION,
          regionname: item.REGIONNAME
        }))
      )
    );
  }

  getCommodities(spid: number = 0): Observable<Commodity[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=002&P_SPID=0`).pipe(
      map((response) =>
        response.map((item) => ({
          name: item.PARAMDESC,
          id: item.PARAMID,
          value: item.PARAMVALUE
        }))
      )
    );
  }

  getDeliveryTypes(spid: number = 0): Observable<DeliveryType[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=006&P_SPID=0`).pipe(
      map((response) =>
        response.map((item) => ({
          name: item.PARAMDESC,
          id: item.PARAMID,
          value: item.PARAMVALUE
        }))
      )
    );
  }

  getTimezones(spid: number = 0): Observable<TimeZone[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=010&P_SPID=0`).pipe(
      map((response) =>
        response.map((item) => ({
          name: item.PARAMDESC,
          id: item.PARAMID,
          value: item.PARAMVALUE
        }))
      )
    );
  }

  getFeeTypes(spid: number = 0): Observable<FeeType[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=009&P_SPID=0`).pipe(
      map((response) =>
        response.map((item) => ({
          name: item.PARAMDESC,
          id: item.PARAMID,
          value: item.PARAMVALUE
        }))
      )
    );
  }

  getBondSuretys(spid: number = 0): Observable<BondSurety[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=003&P_SPID=0`).pipe(
      map((response) =>
        response.map((item) => ({
          name: item.PARAMDESC,
          id: item.PARAMID,
          value: item.PARAMVALUE
        }))
      )
    );
  }

  getCargoPolicies(spid: number = 0): Observable<FeeType[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=004&P_SPID=0`).pipe(
      map((response) =>
        response.map((item) => ({
          name: item.PARAMDESC,
          id: item.PARAMID,
          value: item.PARAMVALUE
        }))
      )
    );
  }

  getCargoSuretys(spid: number = 0): Observable<FeeType[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=005&P_SPID=0`).pipe(
      map((response) =>
        response.map((item) => ({
          name: item.PARAMDESC,
          id: item.PARAMID,
          value: item.PARAMVALUE
        }))
      )
    );
  }

  formatUSDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
