import { Component, Injectable, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { MoviesService } from '../core/services/movies.service';
import { environment } from '../../environments/environment';
import { SlicePipe } from '@angular/common';
import * as moment from 'moment';
import { viewport } from '@popperjs/core';
import { faSort } from '@fortawesome/free-solid-svg-icons';

declare var window: any;
declare var $: any;

const WIKI_URL = 'https://en.wikipedia.org/w/api.php';
const PARAMS = new HttpParams({
  fromObject: {
    action: 'opensearch',
    format: 'json',
    origin: '*'
  }
});

@Injectable()
export class WikipediaService {
  constructor(private http: HttpClient) { }

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get<[any, string[]]>(WIKI_URL, { params: PARAMS.set('search', term) }).pipe(
        map(response => response[1])
      );
  }
}

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  providers: [WikipediaService],
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit, AfterViewInit {
  @ViewChild('testModal') testModal: ElementRef | undefined;
  faSort = faSort;

  public env: any = environment;
  public model: any;
  public searching = false;
  public searchFailed = false;
  public genres: any;
  public movieDetails: any;
  public recommendations: any;

  // rename
  public trailerURL: any;
  public recTrailer: any;
  public imdbLink: String | undefined;

  public formModal: any;

  constructor(private moviesService: MoviesService, private _service: WikipediaService, private http: HttpClient, private elRef: ElementRef) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    console.log("afterviewintit elref nativeElement: ", this.elRef.nativeElement);

    // add modal listen events here..
    // *Problem: The reason why this came out 'undefined' was because the modal was in the *ngIf, DOM was removed...
    let modal = document.getElementById("trailerModal");

    console.log('Modal: ', modal);

    modal?.addEventListener('hidden.bs.modal', (event: any) => {
      console.log('modal close', event);
      document.getElementById("recommend-trailer")?.setAttribute('src', '');
    });

    console.log("viewChild modal:", this.testModal);
  }

  public closeModal() {
    console.log('modal close');
    document.getElementById("recommend-trailer")?.setAttribute('src', '');
  }

  public formatter = (x: { title: string }) => x.title;

  public search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.recommendations = [];
        this.movieDetails = null;
      }),
      switchMap(query => query.length < 3 ? [] :
        this.moviesService.search(query).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      map((data) => {
        return data.slice(0, 10);
      }),
      tap(() => this.searching = false)
    );

  public selectMovie(event: any) {
    console.log("Select Movie Event:", event);

    this.moviesService.movieDetails(event.item.id).subscribe((res: any) => {
      if (res != null) {
        this.movieDetails = res;
        this.movieDetails.trailerURL = this.moviesService.getYoutubeUrl(res.videos.results[0].key);
      }
    });

    this.moviesService.recommendations(event.item.id).subscribe((res: any) => {
      if (res != null) {
        this.recommendations = res;
        console.log('Recommendations:', this.recommendations);
      }
    });

    // change to single api call for trailer instead...!!!
    // this.recommendations = this.moviesService.recommendations(event.item.id).pipe(
    //   switchMap(values => {
    //     console.log("values:", values);
    //     return forkJoin(
    //       values.map((value: any) => this.moviesService.getTrailers(value['id']))).pipe(
    //         map((trailers: any) => trailers.map((trailer: any, index: string | number) => Object.assign(values[index], { trailer: trailer }))
    //         )
    //       );
    //   })
    // );
  }

  public loadTrailer(movieId: number) {
    this.moviesService.trailer(movieId).subscribe((res: any) => {
      if (res != null && res.length != 0) {
        this.recTrailer = this.moviesService.getYoutubeUrl(res[0].key) + '?autoplay=1&amp;modestbranding=1&amp;showinfo=0';
        document.getElementById('recommend-trailer')?.setAttribute('src', this.recTrailer);
        //this.formModal.show();
        $('#trailerModal').modal('show');
      }
      else {
        $('#trailerUnavailable').modal('show');
      }
    });
  }

  public formatDate(date: string) {
    return moment(date).format('MM/DD/YYYY');
  }
}
