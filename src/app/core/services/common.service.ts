import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Region } from '../models/region';
import { Country } from '../models/country';
import { State } from '../models/state';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Lookup APIs
  getCountries(): Observable<Country[]> {
    return this.http.get<any[]>(`${this.apiUrl}/oracle/GetParamValues?P_PARAMTYPE=002`).pipe(
      map((response) =>
        response.map((item) => ({
          name: item.PARAMDESC,
          id: item.PARAMID,
          value: item.PARAMVALUE
        }))
      )
    );
  }

  getStates(country: string): Observable<State[]> {
    return this.http.get<any[]>(`${this.apiUrl}/oracle/GetParamValues?P_PARAMTYPE=001`).pipe(
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
    return this.http.get<any[]>(`${this.apiUrl}/oracle/GetRegions`).pipe(
      map((response) =>
        response.map((item) => ({
          id: item.REGIONID,
          region: item.REGION,
          regionname: item.REGIONNAME
        }))
      )
    );
  }

}
