import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { MoviesService } from '../app/core/services/movies.service';

import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DiscoverComponent } from './discover/discover.component';


@NgModule({
  declarations: [
    AppComponent,
    DiscoverComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    NgxUsefulSwiperModule
  ],
  providers: [
    Title,
    MoviesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
