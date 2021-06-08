import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-detail',
  templateUrl: './edit-detail.page.html',
  styleUrls: ['./edit-detail.page.scss'],
})
export class EditDetailPage implements OnInit {

  lesson = {
    no: "8E2A7B",
    class: "",
    name: "未设置",
    term: "未设置",
    school: "",
    isSchoolLesson: "",
    require: "未设置",
    process: "未设置",
    examination: "未设置"
  }
  public markSchool = "true"
  school = [[]]
  academy = [[]]
  schoolList = {}
  academyList = {}
  public flag = 0;
  public schoolChoosed = "请选择"
  public academyChoosed = "请选择"
  public academyId;
  public schoolOptions = 0;
  public academyOptions = 0;
  selectedSchool: any;
  selectedAcademy: string;
  // courseList: any;
  course = [[]];
  tempCourse: any;
  term = [[]];
  termOptions = 12;
  courseOptions: number;
  mark: any;
  temp: any;

  constructor() { }

  ngOnInit() {
  }

}
