import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Region } from '../models/region';
import { Country } from '../models/country';
import { State } from '../models/state';
import { environment } from '../../../environments/environment';
import { Commodity } from '../models/commodity';
import { DeliveryType } from '../models/delivery-type';
import { TimeZone } from '../models/TimeZone';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private apiUrl = environment.apiUrl;
  private apiDb = environment.apiDb;

  constructor(private http: HttpClient) { }

  getCountries(spid: number = 0): Observable<Country[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=002&P_SPID=${spid}`).pipe(
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
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=001&P_SPID=${spid}`).pipe(
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
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=002&P_SPID=${spid}`).pipe(
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
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=006&P_SPID=${spid}`).pipe(
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
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiDb}/GetParamValues?P_PARAMTYPE=010&P_SPID=${spid}`).pipe(
      map((response) =>
        response.map((item) => ({
          name: item.PARAMDESC,
          id: item.PARAMID,
          value: item.PARAMVALUE
        }))
      )
    );
  }
}
