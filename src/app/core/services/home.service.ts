import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) { }

  getHomePageDataById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/oracle/GetHomePageData/${id}`);
  }

  getCarnetSummaryData(): Observable<any> {
    const userid = this.userService.getUser();
    return this.http.get(`${this.apiUrl}/oracle/GetCarnetSummaryData/${userid}`);
  }
}
