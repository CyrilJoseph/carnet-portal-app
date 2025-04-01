import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private apiUrl = '';//environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Lookup APIs
  getCountries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lookup/countries`);
  }

  getStates(countryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/lookup/states/${countryId}`);
  }

  getRegions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lookup/regions`);
  }

}
