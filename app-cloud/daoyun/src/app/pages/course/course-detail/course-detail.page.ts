import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PickerController, AlertController, NavController, LoadingController, ActionSheetController } from '@ionic/angular';
import { EventService } from 'src/app/shared/services/event.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { Course } from '../course';
import { Geolocation } from '@ionic-native/geolocation/ngx';

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
    private loadingController: LoadingController,
    public nav: NavController,
    public eventService: EventService,
    private actionSheetController: ActionSheetController,
    private geolocation: Geolocation
  ) { }

  public inCourse;

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
    this.inCourse = true;
    this.isTeacher = localStorage.getItem("isTeacher");
    this.course_admin = localStorage.getItem("course-admin");
    this.checkin_admin = localStorage.getItem("checkin-admin");
    this.setCourse();
    console.log('course_detail-ionViewWillEnter');
	}

  ionViewWillLeave(){
    this.eventService.eventEmit.emit('detail-change','详情页返回');
  }

  /**
   * 初始化班课信息
   * @returns {Course}
   */
   initCourse(): Course {
    return {
      id: -1,
      cover: "",
      code: "",
      name: "",
      school: "",
      academy: "",
      teacher: "",
      schoolId: -1,
      academyId: -1,
      teacherId: -1,
      term: "",
      termId: -1,
      join: true,
      status: true,
      lesson: "",
      lessonId: -1,
    };
  }

  setCourse() {
    //先判断是自己的班课吗
    this.course.cover = "image_null";
    this.course.code = this.code;
    var param_in = {
      name: this.code,
      page: 1,
      isSelf: this.inCourse
    };
    var api = '/course';
    this.httpService.get(api, param_in).then(async (response: any) => {
      console.log(response);
      if(response.data.data.total==0){
        this.inCourse = false;
        this.setCourse();
      } else if(response.data.data.total!=0){
        this.course.id = response.data.data.list[0].id;
        this.course.name = response.data.data.list[0].name;
        this.course.lesson = response.data.data.list[0].lesson;
        this.course.school = response.data.data.list[0].school;
        this.course.academy = response.data.data.list[0].academy;
        this.course.teacher = response.data.data.list[0].teacher;
        this.course.term = response.data.data.list[0].term;
        this.course.cover = response.data.data.list[0].image;
        this.course.join = response.data.data.list[0].okJoin;
        this.course.status = response.data.data.list[0].state;
        this.saveData();
      }else{
        const alert = await this.alertController.create({
          message: '班课号错误！',
          buttons: [{
            text: "确认",
            handler: () => {
              this.gotoCourse();
            }
          }]
        })
        await alert.present();
      }
    });
  }

//---------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------一些跳转&删除----------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//

gotoQRcode(){
  this.router.navigate(['/course/create-success']);
}

gotoEdit(){
  this.router.navigate(['/course/edit-detail']);
}

gotoCourse(){
  this.router.navigate(['/tabs/course']);
}

gotoMemberList(){
  this.router.navigate(['/member-list']);
}

gotoCheckinList(){
  this.router.navigate(['/checkin/course-checkin']);
}

async deleteLesson() {
  const alert = await this.alertController.create({
    header: '提示',
    message: '是否确认删除？',
    buttons: [
      {
        text: '取消',
        role: 'cancel',
        cssClass: 'medium'
      }, {
        text: '确认',
        handler: async () => {
          var params = {
            id: this.course.id
          }
          var api = '/course';
          this.httpService.delete(api, params).then(async (response: any) => {
            // console.log(response);
            const alert = await this.alertController.create({
              message: '删除成功！',
              buttons: [{
                text: "确认",
                handler: () => {
                  this.gotoCourse();
                }
              }]
            });
            await alert.present();
          })
        }
      }
    ]
  });
  await alert.present();
}

async outLesson() {
  const alert = await this.alertController.create({
    header: '提示',
    message: '是否确认退出？',
    buttons: [
      {
        text: '取消',
        role: 'cancel',
        cssClass: 'medium'
      }, {
        text: '确认',
        handler: async () => {
          var params = {
            id: this.course.id
          }
          var api = '/course-member';
          this.httpService.delete(api, params).then(async (response: any) => {
            if (response.data.respCode == 1) {
              const alert = await this.alertController.create({
                header: '提示',
                message: '退出成功！',
                buttons: [{
                  text: "确认",
                  handler: () => {
                    this.gotoCourse();
                  }
                }]
              });
              await alert.present();
            }
          })
        }
      }
    ]
  });
  await alert.present();
}

//---------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------加入&状态更新----------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//

updateCourse(){
  var params = {
    id: this.course.id,
    name: this.course.name,
    okJoin: this.course.join,
    state: this.course.status
  }
  var api = '/course'
  this.httpService.put(api, params).then(async (response: any) => {
    // console.log(response);
  });
}

  async joinLesson(){
    const loading = await this.loadingController.create({
      message: '请稍等...',
    });
    await loading.present();
    if(this.course.join==false){
      await loading.dismiss();
      let alert = await this.alertController.create({
        header: '提示',
        message: "该班课不允许加入",
        buttons: ['确定']
      });
      alert.present();
    } else if (this.course.status == false){
      await loading.dismiss();
      let alert = await this.alertController.create({
        header: '提示',
        message: "该班课已结束",
        buttons: ['确定']
      });
      alert.present();
    }else {
      var api = '/course-member';//-------------------------后台接口
      var params = {        //-------------------------后台参数
        code: this.course.code
      }
      this.httpService.post_params(api, params).then(async (response: any) => {
        await loading.dismiss();
        // console.log(response);
        if(response.data.respCode == -1){
          let alert = await this.alertController.create({
            header: '提示',
            message: response.data.msg,
            buttons: ['确定']
          });
          alert.present();
        }else if(response.data.respCode == 1){
          let alert = await this.alertController.create({
            header: '提示',
            message: '加入成功！',
            buttons: [{
              text: '确认',
              cssClass: 'primary',
              handler: (blah) => {
                this.inCourse = true;
              }
            }]
          });
          alert.present();
        }
      });
    }
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------------签到相关部分----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  async createCheckin() {
    const actionSheet = await this.actionSheetController.create({
      mode: "ios",
      buttons: [
        // {
        //   text: '口令签到',   //type2
        //   handler: () => {
        //     this.router.navigate(['/checkin/create-checkin'], {queryParams:{type: 2, code: this.code, id: this.course.id} });
        //   }
        // },
        {
          text: '定位签到',   //type0
          handler: () => {
            this.geolocation.getCurrentPosition().then((resp) => {
              var local = resp.coords.latitude+'-'+resp.coords.longitude;
              var beginStr = this.getTimeStr( Date.now()/1000 );
              var param_0 = {
                type: 0,
                courseId: this.course.id,
                startTimeStr: beginStr,
                local: local
              }
              this.post(param_0);
            }).catch((error) => {
              alert('Error getting location' + error);
            });
          }
        },
        {
          text: '限时签到',   //type1
          handler: () => {
            this.router.navigate(['/checkin/create-checkin']);
          }
        },
        {
          text: '取消',
          role: 'destructive'
        }
      ]
    });
    await actionSheet.present();
  }

  post(param: any){
    var api = '/attendance';
    console.log(param);
    this.httpService.post_data(api, param).then(async (response: any) => {
      console.log(response);
      if(response.data.respCode==1){
        let alert = await this.alertController.create({
          header: '提示',
          message: '签到发起成功！',
          buttons: [{
            text: '确认',
            cssClass: 'primary',
            handler: (blah) => {
              this.router.navigate(['/checkin']);
            }
          }]
        });
        alert.present();
      }else{
        let alert = await this.alertController.create({
          header: '提示',
          message: "签到发起失败！",
          buttons: ['确定']
        });
        alert.present();
      }
    })
  }

  gotoCheckin(){
    this.router.navigate(['/checkin']);
  }

  //----------------------------------------------------------------------------------//
  //------------------------------------JS时间转换-------------------------------------//
  //----------------------------------------------------------------------------------//

  getTimeStr(timestamp){
    var time = new Date(timestamp*1000);
    var date = ((time.getFullYear())  + "-" +
                (time.getMonth()+1).toString().padStart(2,'0') + "-" +
                (time.getDate()).toString().padStart(2,'0') + " " +
                (time.getHours()).toString().padStart(2,'0') + ":" +
                (time.getMinutes()).toString().padStart(2,'0') + ":" +
                (time.getSeconds()).toString().padStart(2,'0')
               );
    return date;
  }

  //----------------------------------------------------------------------------------//
  //-----------------------------------预存班课数据------------------------------------//
  //----------------------------------------------------------------------------------//
  saveData() {
    localStorage.setItem('courseCode', this.course.code);
    localStorage.setItem('courseId', this.course.id.toString());
    localStorage.setItem('courseName', this.course.name);
    //获取成员数
    var param = {
      courseId: this.course.id
    };
    var api = '/course-member';
    this.httpService.get(api, param).then(async (response: any) => {
      console.log(response);
      localStorage.setItem('memberNum', response.data.data.total); 
    });
  }
}