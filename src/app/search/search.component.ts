import { Component, Injectable, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, of, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, takeUntil } from 'rxjs/operators';
import { MovieAndSimilarData, MoviesService } from '../core/services/movies.service';
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

// @Injectable()
// export class WikipediaService {
//   constructor(private http: HttpClient) { }

//   search(term: string) {
//     if (term === '') {
//       return of([]);
//     }

//     return this.http
//       .get<[any, string[]]>(WIKI_URL, { params: PARAMS.set('search', term) }).pipe(
//         map(response => response[1])
//       );
//   }
// }

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  // providers: [WikipediaService],
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

  constructor(private moviesService: MoviesService, private http: HttpClient, private elRef: ElementRef) { } //private _service: WikipediaService,

  private destroyed$ = new Subject();

  // public data!: MovieAndSimilarData;

  ngOnInit(): void {
    // all components that want to receive data will subscribe to one method
    this.moviesService.getMovieAndRecomendations().pipe(
      // it is now important to unsubscribe from the subject
      takeUntil(this.destroyed$)
    ).subscribe(res => {
      //console.log("Latest:", res); // the latest data

      this.movieDetails = res.movieDetails;
      this.movieDetails.trailerURL = res.movieDetails.videos.results[0] != null ? this.moviesService.getYoutubeUrl(res.movieDetails.videos.results[0].key) : null;

      this.recommendations = res.similarMovies;
    });

    this.scrollMonitor();
  }

  ngAfterViewInit(): void {
    //console.log("afterviewintit elref nativeElement: ", this.elRef.nativeElement);

    // add modal listen events here..
    // *Problem: The reason why this came out 'undefined' was because the modal was in the *ngIf, DOM was removed...
    let modal = document.getElementById("trailerModal");

    //console.log('Modal: ', modal);

    modal?.addEventListener('hidden.bs.modal', (event: any) => {
      //console.log('modal close', event);
      document.getElementById("recommend-trailer")?.setAttribute('src', '');
    });

    //console.log("viewChild modal:", this.testModal);
  }

  ngOnDestroy() {
    this.destroyed$.next;
    this.destroyed$.complete;
  }

  // For observing first ngIf appearance.
  private scrollMonitor() {
    let element = document.getElementById('movie-details');
    if (element) {
      this.scrollToSearchBar();
    }

    let observer = new MutationObserver(mutations => {
      mutations.forEach((mutation) => {
        let nodes = Array.from(mutation.addedNodes);
        for (var node of nodes) {
          if (node.contains(document.getElementById('movie-details'))) {
            this.scrollToSearchBar();
            observer.disconnect();
            return;
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    console.log("Initiated Scroll monitor!")
  }

  private scrollToSearchBar() {
    console.log("Scroll from Search component!")
    document.getElementById('search-bar')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  public closeModal() {
    //console.log('modal close');
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

  public selectMovie(id: number) {
    this.moviesService.refreshMovieAndSimilar(id).subscribe((res: any) => {
      //console.log("Search: ", res);
      this.movieDetails = res[0];
      this.movieDetails.trailerURL = this.movieDetails.videos.results[0] != null ? this.moviesService.getYoutubeUrl(this.movieDetails.videos.results[0].key) : null;

      this.recommendations = res[1];

      document.getElementById('search-bar')?.scrollIntoView({
        behavior: 'smooth'
      });

    });
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
