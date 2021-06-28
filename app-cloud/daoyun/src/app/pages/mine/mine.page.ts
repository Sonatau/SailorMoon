import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EventService } from 'src/app/shared/services/event.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-mine',
  templateUrl: './mine.page.html',
  styleUrls: ['./mine.page.scss'],
})
export class MinePage implements OnInit {

  public user = {
    image: "image_null",
    email: "",
    exp: 0,
    id: -1,
    loginType: -1,
    name: "",
    school: "",
    schoolId: -1,
    sex: 1,   //0男，1女
    sno: "",
    telephone: "",
    password: null
  };
  
  public role;
  public return_flag = 0;

  constructor(private router: Router,
    public httpService: HttpService,
    private alertController: AlertController,
    public eventService: EventService) {
      this.eventService.eventEmit.on('msg-change',()=>{
        // console.log('mine-msg-eventListener');
        this.initUserInfo();
        this.return_flag = 1;
      })
    }

  ngOnInit() {
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------------页面信息展示----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  ionViewWillEnter(){
    if(this.return_flag==0){
      this.initUserInfo();
    }
  }

  initUserInfo(){
    //getUserInfo
    var api = '/userinfo';//后台接口
    var params = { };
    this.httpService.get(api, params).then(async (response: any) => {
      // console.log(response);
      this.user.image = response.data.data.user.image;
      if(response.data.data.user.name != "name_null"){
        this.user.name = response.data.data.user.name;
      }
      if(response.data.data.user.sno != "-1"){
        this.user.sno = response.data.data.user.sno;
      }
    })
    if(localStorage.getItem('isTeacher')=='1'){
      this.role = '老师';
    }else{
      this.role = '学生'
    }
  }

  onLogout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async checkUpdate(){
    const alert = await this.alertController.create({
      header: '提示',
      message: '已是最新版本！',
      buttons: ['确认']
    });
    await alert.present();
  }

}
