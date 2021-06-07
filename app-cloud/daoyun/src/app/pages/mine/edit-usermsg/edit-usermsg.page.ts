import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-usermsg',
  templateUrl: './edit-usermsg.page.html',
  styleUrls: ['./edit-usermsg.page.scss'],
})
export class EditUsermsgPage implements OnInit {

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
  selectedSchool: any;
  selectedAcademy: string;

  constructor() { }

  ngOnInit() {
  }

}
