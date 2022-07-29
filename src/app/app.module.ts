import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from "@angular/forms";
import { MoviesService } from '../app/core/services/movies.service';

import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DiscoverComponent } from './discover/discover.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    DiscoverComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    NgxUsefulSwiperModule,
    NgbModule
  ],
  providers: [
    Title,
    MoviesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
