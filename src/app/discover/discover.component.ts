import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../core/services/movies.service'

@Component({
  selector: 'discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {

  constructor(private movies: MoviesService) { }

  ngOnInit(): void {
    this.movies.discover().subscribe((res: any) => {
      console.log("DiscoverAPI Called:", res);
    });
  }

}
