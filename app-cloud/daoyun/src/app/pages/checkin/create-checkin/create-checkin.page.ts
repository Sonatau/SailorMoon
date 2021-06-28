import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-create-checkin',
  templateUrl: './create-checkin.page.html',
  styleUrls: ['./create-checkin.page.scss'],
})
export class CreateCheckinPage implements OnInit {

  public code;
  // public type;  //0-定位 1-限时 2-口令
  public courseId;

  // public pass;
  public timeLimit: number;

  public beginStr;
  public endStr;

  constructor(public router: Router,
    private toastController: ToastController,
    public httpService: HttpService,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.code = localStorage.getItem('courseCode');
    // this.type = this.activatedRoute.snapshot.queryParams['type'];
    this.courseId = localStorage.getItem('courseId');
  }

  async onSubmit(form: NgForm) {
      // if(this.type==2 && (this.pass=="" || this.pass==null)){
      //   let toast = await this.toastController.create({
      //     message: '请输入口令！',
      //     duration: 2000
      //   });
      //   toast.present();
      if(this.timeLimit==null){
        let toast = await this.toastController.create({
          message: '请选择签到持续时间！',
          duration: 2000
        });
        toast.present();
      } else {
        var begin = Date.now()/1000;
        this.beginStr = this.getTimeStr(begin);
        // if(this.type==1){//0-定位 1-限时 2-口令
          var end = Number(this.getTimeStamp(this.beginStr))+Number(this.timeLimit);
          this.endStr = this.getTimeStr(end);
          var param_1 = {
            type: 1,//this.type,
            courseId: this.courseId,
            startTimeStr: this.beginStr,
            expectEndTimeStr: this.endStr,
            local: 'null'
          }
          this.post(param_1);
        // } else if(this.type==2){
        //   var param_2 = {
        //     type: this.type,
        //     courseId: this.courseId,
        //     startTimeStr: this.beginStr,
        //     code: this.pass
        //   }
        //   this.post(param_2);
        // }
      }
  }

  post(param: any){
    var api = '/attendance';
    // console.log(param);
    this.httpService.post_data(api, param).then(async (response: any) => {
      // console.log(response);
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

  gotodetail(){
    this.router.navigate(['/course/course-detail'], {queryParams:{code: this.code} });
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

  getTimeStamp(dateStr){
    dateStr = dateStr.substring(0,19);
    dateStr = dateStr.replace(/-/g,'/');
    var timeTamp = new Date(dateStr).getTime()/1000;
    return timeTamp;
  }

}
