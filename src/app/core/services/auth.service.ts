import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isUserLoggedIn = false;

  constructor(private http: HttpClient) { }

  // Auth APIs
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password });
  }

  setUserLogin(userloggedin: boolean) {
    this.isUserLoggedIn = userloggedin;
  }

  isLoggedIn() {
    return this.isUserLoggedIn;
  }
}
