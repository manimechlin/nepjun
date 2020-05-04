import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/internal/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) {
    }

    getHeaders(): { headers: HttpHeaders } {
        return {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Authkey': 'ret4e54Zi-KJdy-T7gP99'
            })
        };
    }

    get(path: string): Observable<any> {
        return this.http
            .get<any>(`${environment.PF_API}${path}`, this.getHeaders())
            .pipe(
                tap((res: any) => console.log(`request is ok`)),
                catchError(this.handleError<any>(path))
            );
    }

    post(path: string, body: Object = {}): Observable<any> {
        const data = new FormData();
        Object.keys(body).map(key => {
            data.append(key, body[key]);
        });
        return this.http.post<any>(`${environment.PF_API}${path}`, data, this.getHeaders())
            .pipe(
                tap((res: any) => console.log(`request is ok`)),
                catchError(this.handleError<any>(path))
            );
    }

    // Error handling
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

}