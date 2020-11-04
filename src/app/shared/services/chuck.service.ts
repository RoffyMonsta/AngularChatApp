import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ChuckService {

  constructor(
    private http: HttpClient,
    ) { }

  
    private extractData(res: Response) {
      let body = res;
      return body || {};
    }

   public getJoke(url: string): Observable<any>{
      return this.http.get(url).pipe(
        map(this.extractData))
    };
  
}
