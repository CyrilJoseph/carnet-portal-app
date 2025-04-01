import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://7b3e2f20-9102-4392-bca7-7f4c419bb640.mock.pstmn.io';//environment.apiUrl;
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
