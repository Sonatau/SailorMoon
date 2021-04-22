import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mine',
  templateUrl: './mine.page.html',
  styleUrls: ['./mine.page.scss'],
})
export class MinePage implements OnInit {

  public user = {
    email: localStorage.getItem("email"),
    image: "1",
    role: "",
    sno: "",
    school: "0",
    sex: "0",
    telphone: "0",
    nickname: "0",
    name: "0",
    birth: "0",
    exp: "0"
  };
  isTeacher: any;

  constructor() { }

  ngOnInit() {
  }

}
