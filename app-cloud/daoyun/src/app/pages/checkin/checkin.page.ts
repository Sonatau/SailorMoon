import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage implements OnInit {

  public isTeacher: any;

  public courseCode;
  public courseId

  public checkin = {
    id: -1,
  
    state: 0,
    type: -1,
    courseId: -1,
    exp: -1,
    startTimeStr: "",

    distance: -1,
    expectEndTimeStr: "",
    local: ""
  }

  public successTotal = 0;
  public memberTotal;
  public interval: any = null;
  public canleave = false;
  public checkinState = "已结束"
  public showTime;
  public timeNow
  public PI = 3.141592654; 
  public EARTH_RADIUS = 6378.137;
  public local = [];
  public dis;

  constructor(public router: Router,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    public httpService: HttpService,
    private geolocation: Geolocation,
    private toastController: ToastController) { }

  ngOnInit() {
    this.isTeacher = localStorage.getItem("isTeacher");
  }

  //----------------------------------------------------------------------------------//
  //------------------------------------页面展示--------------------------------------//
  //----------------------------------------------------------------------------------//

  ionViewWillEnter(){
    this.courseCode = localStorage.getItem('courseCode');
    this.courseId = localStorage.getItem('courseId')
    this.setCheckin();
    this.memberTotal = localStorage.getItem('memberNum');
    this.successTotal = 0;
  }

  setCheckin(){
    var params = {
      courseId: this.courseId
    }
    var api = '/attendance-info';
    this.httpService.get(api, params).then(async (response: any) => {
      console.log(response);
      if(response.data.respCode!=-1){
        if(response.data.data.attendance==null){
          this.checkinState = "已结束";
          this.stopRequest();
        }else{
          this.checkin.id = response.data.data.attendance.id;
          this.checkin.state = response.data.data.attendance.state;
          this.checkin.type = response.data.data.attendance.type;
          this.checkin.courseId = response.data.data.attendance.courseId;
          this.checkin.exp = response.data.data.attendance.exp;
          this.checkin.startTimeStr = response.data.data.attendance.startTimeStr;
          this.checkin.distance = response.data.data.attendance.distance;
          this.checkin.expectEndTimeStr = response.data.data.attendance.expectEndTimeStr;
          this.checkin.local = response.data.data.attendance.local;
          this.checkinState = "签到中"
          if(this.isTeacher=='0' && response.data.data.student!=null){
            this.checkinState = "已参与";
            this.showTime = "--:--";
            this.stopRequest();
          }else{
            this.startRequest();
          }
        }
      }
    })
  };

  //----------------------------------------------------------------------------------//
  //-----------------------------------页面跳转逻辑------------------------------------//
  //----------------------------------------------------------------------------------//

  async ionViewWillLeave() {
    this.stopRequest();
    if(this.isTeacher=='1' && this.checkinState=="签到中") {    
      let alert = await this.alertController.create({
        header: '提示',
        message: '有正在进行的签到！',
        buttons: [{
          text: '确认',
          cssClass: 'primary',
          handler: (blah) => {
            this.router.navigate(['/checkin']);
          }
        }],
        backdropDismiss: false
      });
      alert.present();
    }
  }

  gotodetail(){
    this.router.navigate(['/course/course-detail'], {queryParams:{code: this.courseCode} });
  }

  gotoMemCheck(){
    this.router.navigate(['/member-list/member-checkin'], {queryParams:{stuId: localStorage.getItem('UserId')} });
  }

  gotoMemberList(){
    this.router.navigate(['/member-list']);
  }

  //----------------------------------------------------------------------------------//
  //-----------------------------------签到状态轮询------------------------------------//
  //----------------------------------------------------------------------------------//
  getCheckResult(){
    var params = {
      attendanceId: this.checkin.id,
      realTime: true
    }
    var api = '/attendance-result'
    this.httpService.get(api, params).then(async (response: any) => {
      console.log(response.data);
      this.successTotal = response.data.data.total;
      this.checkin.state = response.data.data.state;
      if(this.checkin.state!=0){
        this.setCheckin();
      }
    })
    this.timeNow = this.getTimeStr(Date.now()/1000);
    if(this.checkin.type==1){
      var sec = Number(this.getTimeStamp(this.checkin.expectEndTimeStr)) - Number(this.getTimeStamp(this.timeNow));
      this.showTime = Math.trunc((sec/60)).toString().padStart(2,'0') + ':' + (sec%60).toString().padStart(2,'0')
      if(sec<=0 && this.checkin.state==0){
        this.endCheckin(1);
      }
    }else{
      this.showTime = this.timeNow.split(' ');
      this.showTime = this.showTime[1];
    }
  }

  startRequest() {//启动计时器函数
    if (this.interval != null) {//判断计时器是否为空
      clearInterval(this.interval);
      this.interval = null;
    }
    this.interval = setInterval(() => {
      this.getCheckResult();
    }, 1000);
  }

  stopRequest() {
    clearInterval(this.interval);
    this.interval = null;
  }

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

  getTimeStamp(dateStr){
    dateStr = dateStr.substring(0,19);
    dateStr = dateStr.replace(/-/g,'/');
    var timeTamp = new Date(dateStr).getTime()/1000;
    return timeTamp;
  }

  //----------------------------------------------------------------------------------//
  //-----------------------------------签到功能逻辑------------------------------------//
  //----------------------------------------------------------------------------------//
  async joinCheckin(){
    if(this.checkinState=="签到中"){
      if(this.checkin.type==0){//定位签到
        //获取当前定位
        this.geolocation.getCurrentPosition().then(async (resp) => {
          this.local[0] = resp.coords.latitude;
          this.local[1] = resp.coords.longitude;
          var teacher_loc = this.checkin.local.split('-');
          //计算距离
          var a = Math.abs(this.Rad(Number(teacher_loc[0])) - this.Rad(Number(this.local[0])));
          var b = Math.abs(this.Rad(Number(teacher_loc[1])) - this.Rad(Number(this.local[1])));
          this.dis = 2 * Math.asin( Math.sqrt( Math.pow(Math.sin(a/2), 2)
            + Math.cos(this.Rad(Number(teacher_loc[0])))*Math.cos(this.Rad(Number(this.local[0])))*Math.pow(Math.sin(b/2),2)
            ));
          this.dis = this.dis * this.EARTH_RADIUS * 1000;
          // console.log(this.local);
          // console.log(teacher_loc);
          // console.log(this.dis);
          if(this.dis<=this.checkin.distance){
            var param_0 = {
              studentId: localStorage.getItem('UserId'),
              attendanceId: this.checkin.id,
              state: 0,
              attendanceTimeStr: this.timeNow
            }
            this.postCheckin(param_0);
          } else {
            let toast = await this.toastController.create({
              message: '超出签到范围！',
              duration: 2000
            });
            toast.present();
          }
        }).catch((error) => {
          alert('Error getting location' + error);
        });
      }else if(this.checkin.type==1){//限时签到
        var checkinTime = this.timeNow;
        if(this.getTimeStamp(this.timeNow)<=this.getTimeStamp(this.checkin.expectEndTimeStr)){
          var param_1 = {
            studentId: localStorage.getItem('UserId'),
            attendanceId: this.checkin.id,
            state: 0,
            attendanceTimeStr: checkinTime
          }
          this.postCheckin(param_1);
        } else {
          let toast = await this.toastController.create({
            message: '签到超时！',
            duration: 2000
          });
          toast.present();
        }
      }
    }
  }

  Rad(d)
  {
    return d * this.PI / 180.0;
  }

  postCheckin(param: any){
    var api = "/attendance-result";
    this.httpService.post_data(api, param).then(async (response: any) => {
      console.log(response);
      if(response.data.respCode!=-1){
        let alert = await this.alertController.create({
          header: '提示',
          message: '签到成功！',
          buttons: [{
            text: '确认',
            cssClass: 'primary',
          }],
        });
        alert.present();
        this.setCheckin();
      }
    })
  }

  endCheckin(endType: any){
    var param = {
      id: this.checkin.id,
      type: endType
    }
    var api = "/attendance";
    this.httpService.delete(api, param).then(async (response: any) => {
      console.log(response);
      if(response.data.respCode!=-1){
        this.stopRequest();
        this.setCheckin();
      }else{
        let toast = await this.toastController.create({
          message: '该签到已结束，请勿重复操作！',
          duration: 2000
        });
        toast.present();
      }
    });
  }

}
