import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'myFooter',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public getYear() {
    return moment().format("YYYY");
  }
}
