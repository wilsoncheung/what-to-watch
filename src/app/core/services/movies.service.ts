import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private _headers: HttpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('api-key', environment.apiKey);

  constructor(private http: HttpClient) { }

  public discover() {
    let headers = this._headers;

    return this.http.get(`${environment.baseURL}discover/movie?api_key=${environment.apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`, { headers });
  }
}
