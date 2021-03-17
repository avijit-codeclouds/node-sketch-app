import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { catchError, map, retry } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment'
import Konva from 'konva';
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  API_URL: string = environment.apiURL
  // headers = new HttpHeaders().set('Content-Type', 'application/json');
  token : string
  headers :any

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public authService: AuthService
  ) { 
    // this.authService.user.subscribe(x => { 
    //   // console.log(x)
    //   this.token = x
    //   this.headers = new HttpHeaders()
    //   // .set('Content-Type', 'application/json')
    //   .set("Authorization", "x-auth-token " + x);
    // });
  }

  saveDrawString(node: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/drawing/save`, node)
    .pipe(retry(3), catchError(this.handleError));
  }

  updateCanvas(payload: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/drawing/canvas/update`, payload)
    .pipe(retry(3), catchError(this.handleError));
  }

  canvasList() : Observable<any> {
    return this.httpClient.get(`${this.API_URL}/drawing/canvas-list`)
    .pipe(retry(3), catchError(this.handleError));
  }

  getParticularCanvas(canvas_id : any) : Observable<any> { 
    return this.httpClient.get(`${this.API_URL}/drawing/canvas/`+canvas_id)
    .pipe(retry(3), catchError(this.handleError));
  }

  getAuthUserDetails() : Observable<any> {
    return this.httpClient.get(`${this.API_URL}/auth`)
    .pipe(retry(3), catchError(this.handleError));
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
  
  line(pos, mode: string = 'brush',color: any) {
    // console.log(`color SV :: ${color}`)
    return new Konva.Line({
      stroke: color,
      strokeWidth: 5,
      globalCompositeOperation:
        mode === 'brush' ? 'source-over' : 'destination-out',
      points: [pos.x, pos.y],
    });
  }
  
}
