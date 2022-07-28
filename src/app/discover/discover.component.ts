import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../core/services/movies.service';
import { environment } from '../../environments/environment';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  faFilm = faFilm;
  public env: any = environment;
  public movies: any;

  constructor(private moviesService: MoviesService) { }

  ngOnInit(): void {

    this.moviesService.discover().subscribe((res: any) => {
      if (res != null) {
        console.log("DiscoverAPI Called:", res);
        this.movies = res.results.slice(0, 6); // show 6 for now, implement pagination...
        //this.movies = res.results;
      }
    });
  }

}
