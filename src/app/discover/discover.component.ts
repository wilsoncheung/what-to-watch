import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../core/services/movies.service';
import { environment } from '../../environments/environment';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  faFilm = faFilm;
  public env: any = environment;
  public movies: any;
  public isDataLoaded: boolean = false;

  config: SwiperOptions = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    spaceBetween: 10,
    slidesPerView: 6,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    breakpoints: {
      1024: {
        slidesPerView: 6
      },
      500: {
        slidesPerView: 3
      },
      400: {
        slidesPerView: 2
      },
      300: {
        slidesPerView: 1
      }
    },
  };

  constructor(private moviesService: MoviesService) { }

  ngOnInit(): void {

    this.moviesService.discover().subscribe((res: any) => {
      if (res != null) {
        this.isDataLoaded = true; // has to set this flag for swiper loop to work! - prevent swiper to be loaded before slides are ready.
        console.log("DiscoverAPI Called:", res);
        this.movies = res.results;
      }
    });
  }

}
