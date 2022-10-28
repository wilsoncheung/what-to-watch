import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, of, Subject, ReplaySubject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


export interface MovieAndSimilarData {
  movieDetails: any,
  similarMovies: any
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private _headers: HttpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('api-key', environment.apiKey);

  private httpOptions = { headers: this._headers };

  private _data$ = new ReplaySubject<MovieAndSimilarData>();

  constructor(private http: HttpClient) { }

  public getYoutubeUrl(key: string) {
    return "https://www.youtube.com/embed/" + key;
  }

  public discover() {
    //let headers = this._headers;

    return this.http.get(`${environment.baseURL}discover/movie?api_key=${environment.apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`, this.httpOptions);
  }

  public genres() {
    //let headers = this._headers;

    return this.http.get(`${environment.baseURL}genre/movie/list?api_key=${environment.apiKey}&language=en-US`, this.httpOptions);
  }

  public search(query: string) {
    //let headers = this._headers;

    if (query === '') {
      return of([]);
    }

    return this.http.get<any>(`${environment.baseURL}search/movie?api_key=${environment.apiKey}&language=en-US&query=${query}&page=1&include_adult=false`, this.httpOptions)
      .pipe(map(response => response.results));
  }

  public multiSearch(query: string) {
    //let headers = this._headers;

    if (query === '') {
      return of([]);
    }

    return this.http.get<any>(`${environment.baseURL}search/multi?api_key=${environment.apiKey}&language=en-US&query=${query}&page=1&include_adult=false`, this.httpOptions)
      .pipe(map(response => response.results));
  }

  public movieDetails(id: number) {
    //let headers = this._headers;

    if (typeof id != "number") {
      return of([]);
    }

    return this.http.get(`${environment.baseURL}movie/${id}?api_key=${environment.apiKey}&language=en-US&append_to_response=videos`, this.httpOptions);
  }

  public recommendations(id: number) {
    //let headers = this._headers;

    if (typeof id != "number") {
      return of([]);
    }

    return this.http.get<any>(`${environment.baseURL}movie/${id}/recommendations?api_key=${environment.apiKey}&language=en-US&page=1`, this.httpOptions)
      .pipe(map(resp => resp.results));
  }

  public movieAndRecommendations(id: number): Observable<any> {
    if (typeof id != "number") {
      return of([]);
    }

    let movieDetailsAPI = this.movieDetails(id);
    let recommendationsAPI = this.similar(id);

    return forkJoin([movieDetailsAPI, recommendationsAPI]);
  }

  public refreshMovieAndSimilar(id: number): Observable<any> {

    let movieDetailsAPI = this.movieDetails(id);
    let recommendationsAPI = this.similar(id);

    return forkJoin([movieDetailsAPI, recommendationsAPI]).pipe(
      tap(response => {
        // notify all subscribers of new data
        this._data$.next({
          movieDetails: response[0],
          similarMovies: response[1]
        });
      })
    );
  }

  public getMovieAndRecomendations(): Observable<MovieAndSimilarData> {
    return this._data$.asObservable();
  }

  public similar(id: number) {
    //let headers = this._headers;

    if (typeof id != "number") {
      return of([]);
    }

    return this.http.get<any>(`${environment.baseURL}movie/${id}/similar?api_key=${environment.apiKey}&language=en-US&page=1`, this.httpOptions)
      .pipe(map(resp => resp.results));
  }

  public trailer(id: number) {
    //let headers = this._headers;

    if (typeof id != "number") {
      return of([]);
    }

    return this.http.get<any>(`${environment.baseURL}movie/${id}/videos?api_key=${environment.apiKey}&language=en-US`, this.httpOptions)
      .pipe(map(resp => resp.results));
  }
}
