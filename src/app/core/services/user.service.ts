import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USER_EMAIL_KEY = 'CurrentUserEmail';

  constructor(private storageService: StorageService) { }

  setUser(email: string): void {
    if (!email) {
      console.error('Cannot set empty user email');
      return;
    }
    this.storageService.setItem(this.USER_EMAIL_KEY, email);
  }

  getUser(): string | null {
    return this.storageService.getItem(this.USER_EMAIL_KEY);
  }

  clearUser(): void {
    this.storageService.removeItem(this.USER_EMAIL_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  getSafeUser(): string {
    return this.getUser() || '';
  }
}
