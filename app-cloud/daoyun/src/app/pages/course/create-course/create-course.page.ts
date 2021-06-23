import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController, PickerController, Platform } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';
import { Course } from '../course';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.page.html',
  styleUrls: ['./create-course.page.scss'],
})
export class CreateCoursePage implements OnInit {

  public course: Course;
  schoolList = {
    total: 0,
    schools: {}
  }
  academyList = {
    total: 0,
    academys: {}
  }
  majorList = {
    total: 0,
    majors: {}
  }
  public flag = 0;
  public schoolChoosed = "请选择"
  public academyChoosed = "请选择"
  public majorChoosed = "请选择"
  public schoolOptions = 0;
  public academyOptions = 0;
  public majorOptions = 0;

  //----------------------------------------------------------不知道有用无用可能要被删掉的-------------------------------------------//
  selectedSchool: any;
  selectedAcademy: string;
  // courseList: any;
  // course = [[]];
  tempCourse: any;
  term = [[]];
  termOptions = 12;
  courseOptions: number;
  mark: any;
  temp: any;
  //-------------------------------------------------------------------------------------------------------------------------------//

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public httpService: HttpService,
    public http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    public pickerController: PickerController,
    public platform: Platform
  ) { 
    this.course = this.initCourse();
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.course = this.initCourse();
    var param = {
      page: 1
    };
    var api = '/school';//后台接口
    this.httpService.get(api, param).then(async (response: any) => {
      console.log(response);
    })
  }

  /**
   * 初始化课程
   * @returns {Course}
   */
   initCourse(): Course {
    return {
      covers: [],
      code: '',
      name: '',
      school: '',
      academy: '',
      major: '',
      schoolId: null,
      academyId: null,
      majorId: null,
      teacher: ''
    };
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-------------------------------------------------------请求学校列表---------------------------------------------------------//


  // async openPicker(numColumns = 1, numOptions, multiColumnOptions, isSchool) {
  //   if (isSchool != 1 && this.lesson.school.length == 0) {
  //     const alert = await this.alertController.create({
  //       header: '警告',
  //       message: '请先选择学校！',
  //       buttons: ['确认']
  //     });
  //     await alert.present();
  //   } else {
  //     const picker = await this.pickerController.create({
  //       columns: this.getColumns(numColumns, numOptions, multiColumnOptions, isSchool),
  //       buttons: [
  //         {
  //           text: '取消',
  //           role: 'cancel'
  //         },
  //         {
  //           text: '确认',
  //           handler: (value) => {
  //             var selected = this.getColumns(numColumns, numOptions, multiColumnOptions, isSchool);
  //             if (isSchool == 1) {
  //               this.flag = 1;
  //               this.academyId = selected[0].options[value.col.value].id;
  //               this.schoolChoosed = value.col.text;
  //               this.lesson.school = "";
  //               this.selectedSchool = selected[0].options[value.col.value].code;
  //               this.lesson.school += this.selectedSchool;
  //               //获取学院列表
  //               this.academy[0].length = 0;
  //               var param = {
  //                 academy: this.academyId,
  //               }
  //               this.academyChoosed = '未设置';
  //               var api = '/schools';//后台接口
  //               this.httpService.get(api, param).then(async (response: any) => {
  //                 for (var i = 0; i < response.data.length; i++) {
  //                   this.academy[0].push(response.data[i].name);
  //                 }
  //                 this.academyList = response.data;
  //                 this.academyOptions = this.academy[0].length;
  //               })
  //             } else {
  //               this.flag++;//2
  //               if (this.flag > 2) {
  //                 this.flag--;
  //                 this.lesson.school = this.selectedSchool;
  //               }
  //               if (this.lesson.school.length == 0) {
  //                 console.log("请先选择学校");
  //               } else {
  //                 this.academyChoosed = value.col.text;
  //                 this.selectedAcademy = selected[0].options[value.col.value].code;
  //                 this.lesson.school += "/" + this.selectedAcademy;
  //               }

  //             }
  //           }
  //         }
  //       ]
  //     });
  //     await picker.present();
  //   }
  // }

  // getColumns(numColumns, numOptions, columnOptions, isSchool) {
  //   let columns = [];
  //   for (let i = 0; i < numColumns; i++) {
  //     columns.push({
  //       name: `col`,
  //       options: this.getColumnOptions(i, numOptions, columnOptions, isSchool)
  //     });
  //   }
  //   return columns;
  // }

  // getColumnOptions(columnIndex, numOptions, columnOptions, isSchool) {
  //   let options = [];
  //   for (let i = 0; i < numOptions; i++) {
  //     if (isSchool == 1) {
  //       for (let j = 0; j < this.schoolOptions; j++) {
  //         if (this.schoolList[j].name == columnOptions[columnIndex][i % numOptions]) {
  //           options.push({
  //             text: columnOptions[columnIndex][i % numOptions],
  //             value: i,
  //             code: this.schoolList[j].code,
  //             id: this.schoolList[j].id
  //           })
  //         }
  //       }
  //     } else {
  //       for (let j = 0; j < this.academyOptions; j++) {
  //         if (this.academyList[j].name == columnOptions[columnIndex][i % numOptions]) {
  //           options.push({
  //             text: columnOptions[columnIndex][i % numOptions],
  //             value: i,
  //             code: this.academyList[j].code,
  //             id: this.academyList[j].id
  //           })
  //         }
  //       }
  //     }
  //   }
  //   return options;
  // }

  // onCreate(form: NgForm) {
  //   if (form.valid) {
  //     if (this.markSchool) {
  //       this.lesson.isSchoolLesson = "1";
  //     } else {
  //       this.lesson.isSchoolLesson = "0";
  //     }
  //     var params = this.lesson;
  //     params["email"] = localStorage.getItem("email");
  //     var api = '/courses';//后台接口
  //     this.httpService.post(api, params).then(async (response: any) => {
  //       // console.log(response.data);
  //       localStorage.setItem("create-code", response.data)
  //       const alert = await this.alertController.create({
  //         // header: '创建班课成功',
  //         message: '创建班课成功！',
  //         buttons: [
  //           {
  //             text: '确认',
  //             cssClass: 'secondary',
  //             handler: (blah) => {
  //               // localStorage.setItem("origin",'0');
  //               this.router.navigateByUrl('/create-success');
  //             }
  //           }
  //         ]
  //       });
  //       await alert.present();
  //     })

  //   }
  // }

  // getTime() {
  //   let myDate = new Date();
  //   //获取当前年
  //   var year = myDate.getFullYear();
  //   for (var i = 0; i < 6; i++) {
  //     var start = year + i -2;
  //     var end = start + 1;
  //     this.term[0].push(start + "-" + end + "-01");
  //     this.term[0].push(start + "-" + end + "-02");
  //   }
  //   this.term[0].push("不设置学期")
  // }

  // async termPicker(numColumns = 1, numOptions, columnOptions) {

  //   const picker = await this.pickerController.create({
  //     columns: this.getTermColumns(numColumns, numOptions, columnOptions),
  //     buttons: [
  //       {
  //         text: '取消',
  //         role: 'cancel'
  //       },
  //       {
  //         text: '确认',
  //         handler: (value) => {
  //           this.lesson.term = value.col.text;
  //         }
  //       }
  //     ]
  //   });

  //   await picker.present();
  // }

  // getTermColumns(numColumns, numOptions, columnOptions) {
  //   let columns = [];
  //   for (let i = 0; i < numColumns; i++) {
  //     columns.push({
  //       name: `col`,
  //       options: this.getTermColumnOptions(i, numOptions, columnOptions)
  //     });
  //   }

  //   return columns;
  // }

  // getTermColumnOptions(columnIndex, numOptions, columnOptions) {
  //   let options = [];
  //   for (let i = 0; i < numOptions; i++) {
  //     options.push({
  //       text: columnOptions[columnIndex][i % numOptions],
  //       value: i
  //     })
  //   }

  //   return options;
  // }

  // async coursePicker(numColumns = 1, numOptions, columnOptions) {

  //   const picker = await this.pickerController.create({
  //     columns: this.getCourseColumns(numColumns, numOptions, columnOptions),
  //     buttons: [
  //       {
  //         text: '取消',
  //         role: 'cancel'
  //       },
  //       {
  //         text: '确认',
  //         handler: (value) => {
  //           // console.log(value.col.text);
  //           this.lesson.name = value.col.text;
  //         }
  //       }
  //     ]
  //   });

  //   await picker.present();
  // }

  // getCourseColumns(numColumns, numOptions, columnOptions) {
  //   let columns = [];
  //   for (let i = 0; i < numColumns; i++) {
  //     columns.push({
  //       name: `col`,
  //       options: this.getCourseColumnOptions(i, numOptions, columnOptions)
  //     });
  //   }

  //   return columns;
  // }

  // getCourseColumnOptions(columnIndex, numOptions, columnOptions) {
  //   let options = [];
  //   for (let i = 0; i < numOptions; i++) {
  //     options.push({
  //       text: columnOptions[columnIndex][i % numOptions],
  //       value: i
  //     })
  //   }

  //   return options;
  // }

  // toAdd(){
  //   this.router.navigateByUrl('/add-lesson-name');
  //   localStorage.setItem("isCreate",'1');
  // }

}
