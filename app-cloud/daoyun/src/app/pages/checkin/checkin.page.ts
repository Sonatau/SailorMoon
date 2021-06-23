import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage implements OnInit {

  public isTeacher: any;

  constructor() { }

  ngOnInit() {
    this.isTeacher = localStorage.getItem("isTeacher");
  }

}
