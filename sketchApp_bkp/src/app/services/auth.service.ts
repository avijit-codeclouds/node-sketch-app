import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { catchError, map, retry } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment'
import { User } from '../models/user'

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL: string = environment.apiURL
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  private token: string;

  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(private httpClient: HttpClient,public router: Router) { 
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  register(user: any) : Observable<any> { 
    return this.httpClient.post(`${this.API_URL}/users/create`, user)
    .pipe(retry(3), catchError(this.handleError));
  }

  public get currentUserValue(): any {
    return this.userSubject.value;
  }

  // userValue(): User {
  //   console.log(`get User subject value ::`)
  //   console.log(this.userSubject.value)
  //   return this.userSubject.value;
  // }

  saveToken(token: string): void {
    // localStorage.setItem("mean-token", token);
    this.token = token;
    localStorage.setItem('user', JSON.stringify(token));
    this.userSubject.next(token);
  }

  // getToken(): string {
  //   if (!this.token) {
  //     // this.token = localStorage.getItem("mean-token");
  //     this.token = localStorage.getItem("user");
  //   }
  //   console.log(this.token)
  //   return this.token;
  // }

  logout(): void {
    this.token = "";
    // window.localStorage.removeItem("mean-token");

    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  // getUserDetails(): UserDetails {
  //   const token = this.getToken();
  //   let payload;
  //   console.log(JSON.parse(token))
  //   if (token) {
  //     payload = token.split(".")[1];
  //     payload = window.atob(payload);
  //     console.log(payload)
  //     return JSON.parse(payload);
  //   } else {
  //     return null;
  //   }
  // }

  isLoggedIn(): boolean {
    // const user = this.getUserDetails();
    if (!this.token) {
      // this.token = localStorage.getItem("mean-token");
      this.token = localStorage.getItem("user");
    }
    const token = this.token
    let payload;
    console.log(JSON.parse(token))
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      console.log(payload)
      // return JSON.parse(payload);
      payload = JSON.parse(payload);
    } else {
      // return null;
      payload = null
    }
    console.log(`get payload :::`)
    console.log(payload)
    const user = payload
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  // get userValue(): User {
  //   return this.userSubject.value;
  // }

  login(user: any): Observable<any> {
    // return this.request("post", "login", user);
    return this.httpClient.post(`${this.API_URL}/auth`, user)
    .pipe(retry(3), catchError(this.handleError));

    // return this.httpClient.post<User>(`${this.API_URL}/auth`, user)
    // .pipe(retry(3),catchError(this.handleError),map(user => {
    //     // store user details and jwt token in local storage to keep user logged in between page refreshes
    //     localStorage.setItem('user', JSON.stringify(user));
    //     this.userSubject.next(user);
    //     return user;
    // }));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(error)
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
