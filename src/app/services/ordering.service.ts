import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/internal/operators';


@Injectable({
  providedIn: 'root'
})
export class OrderingService {

  BASE_URL: any = environment.SERVER_URL + '/api/';

  constructor(private http: HttpClient) {}

  protected getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authkey': 'T1rS54ZW-pHtV-2L2idP'
      })
    };
  }

  get(path: string): Observable<any> {
    return this.http
      .get<any>(`${this.BASE_URL}${path}`, this.getHeaders())
      .pipe(
        tap((res: any) => console.log(`request is ok`)),
        catchError(this.handleError<any>(path))
      );
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}${path}`, body, this.getHeaders())
      .pipe(
        tap((res: any) => console.log(`request is ok`)),
        catchError(this.handleError<any>(path))
      );
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
