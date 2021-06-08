import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PickerController, AlertController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';
import { Course } from '../course';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.page.html',
  styleUrls: ['./course-detail.page.scss'],
})
export class CourseDetailPage implements OnInit {

  public code: string;
  public course: Course;

  public isTeacher: any;
  public course_admin: any;
  public checkin_admin: any;

  constructor(
    private router: Router,
    public httpService: HttpService,
    public http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public pickerController: PickerController,
    private alertController: AlertController,
    //private statusBar: StatusBar,
  ) { }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------初始信息展示-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  ngOnInit() {
    this.course = this.initCourse();
    this.isTeacher = localStorage.getItem("isTeacher");
    this.course_admin = localStorage.getItem("course-admin");
    this.checkin_admin = localStorage.getItem("checkin-admin");
  }

  ionViewWillEnter(){
    this.code = this.activatedRoute.snapshot.queryParams['code'];
    this.setCourse();
	}

  /**
   * 初始化课程信息
   * @returns {Course}
   */
   initCourse(): Course {
    return {
      covers: [],
      code: "",
      name: "",
      school: "",
      academy: "",
      major: "",
      teacher: "",
      schoolId: -1,
      academyId: -1,
      majorId: -1,
      teacherId: -1
    };
  }

  setCourse() {
    this.course.covers = [];
    this.course.code = this.code;
    var param = {
      code: this.code,
      page: 1
    };
    var api = '/course';
    this.httpService.get(api, param).then(async (response: any) => {
      console.log(response);
      this.course.name = response.data.data.list[0].name;
      this.course.school = response.data.data.list[0].school;
      this.course.academy = response.data.data.list[0].academy;
      this.course.major = response.data.data.list[0].major;
      this.course.teacher = response.data.data.list[0].teacher;
      this.course.covers.push(response.data.data.list[0].image);
      this.course.schoolId = response.data.data.list[0].schoolId;
      this.course.academyId = response.data.data.list[0].academyId;
      this.course.majorId = response.data.data.list[0].majorId;
      this.course.teacherId = response.data.data.list[0].teacherId;
    });
  }

//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------一些跳转&删除----------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//

gotoQRcode(){
  this.router.navigate(['/course/create-success'], {queryParams:{code: this.code} });
}

gotoEdit(){
  this.router.navigate(['/course/edit-de'], {queryParams:{code: this.code} });
}

  // async deleteLesson() {
  //   const alert = await this.alertController.create({
  //     header: '提示',
  //     message: '是否确认删除？',
  //     buttons: [
  //       {
  //         text: '取消',
  //         role: 'cancel',
  //         cssClass: 'medium'
  //       }, {
  //         text: '确认',
  //         handler: async () => {
  //           const alert = await this.alertController.create({
  //             // header: '提示',
  //             message: '删除成功！',
  //             buttons: [{
  //               text: "确认",
  //               // handler: () => {
  //               //   var params = {
  //               //     code: localStorage.getItem("lesson_no")
  //               //   }
  //               //   var api = '/courses';
  //               //   this.httpService.delete(api, params).then(async (response: any) => {
  //               //     if (response.data.respCode == 1) {
  //               //       this.router.navigate(['/lesson-tabs/mylesson'], {queryParams: {delete: '1'}});
  //               //   // location.replace('/lesson-tabs');
  //               //     }
  //               //   })
  //               // }
  //               handler: () => {
  //                 this.router.navigate(['/tabs/course'], {queryParams: {join: '1'}});
  //               }
  //             }]
  //           });
  //           await alert.present();
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
    
    
  // }

  // async outLesson() {
  //   const alert = await this.alertController.create({
  //     header: '提示',
  //     message: '是否确认退出？',
  //     buttons: [
  //       {
  //         text: '取消',
  //         role: 'cancel',
  //         cssClass: 'medium'
  //       }, {
  //         text: '确认',
  //         // handler: async () => {
  //         //   var params = {
  //         //     code: localStorage.getItem("lesson_no"),
  //         //     email: localStorage.getItem("email")
  //         //   }
  //         //   var api = '/courses';
  //         //   this.httpService.delete(api, params).then(async (response: any) => {
  //         //     if (response.data.respCode == 1) {
  //         //       const alert = await this.alertController.create({
  //         //         // header: '提示',
  //         //         message: '退出成功！',
  //         //         buttons: [{
  //         //           text: "确认",
  //         //           handler: () => {
  //         //             this.router.navigate(['/tabs/course'], {queryParams: {join: '1'}});
  //         //           }
  //         //         }]
  //         //       });
  //         //       await alert.present();
  //         //     }
  //         //   })
  //         // }
  //         handler: () => {
  //           this.router.navigate(['/tabs/course'], {queryParams: {join: '1'}});
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
    
  // }

}