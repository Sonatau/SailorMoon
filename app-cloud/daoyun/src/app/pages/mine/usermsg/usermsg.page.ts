import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, PickerController, ToastController, LoadingController } from '@ionic/angular';
import { EventService } from 'src/app/shared/services/event.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-usermsg',
  templateUrl: './usermsg.page.html',
  styleUrls: ['./usermsg.page.scss'],
})
export class UsermsgPage implements OnInit {

  public user = {
    image: "image_null",
    email: "未设置",
    exp: 0,
    id: -1,
    loginType: -1,
    name: "",
    school: "",
    schoolId: -1,
    sex: "",   //0男，1女
    sno: "",
    telephone: "未设置",
    password: null
  };
  public role;
  public return_flag = 0;

  constructor(public router: Router, public httpService: HttpService,
    public http: HttpClient,
    public pickerController: PickerController,
    public toast: ToastController,
    public loadingController: LoadingController,
    public eventService: EventService) {
      this.eventService.eventEmit.on('user-detail-change',()=>{
        console.log('usermsg-eventListener');
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

  ionViewWillLeave(){
    this.eventService.eventEmit.emit('msg-change','用户信息页返回');
  }

  initUserInfo(){
    //getUserInfo
    var api = '/userinfo';//后台接口
    var params = { };
    this.httpService.get(api, params).then(async (response: any) => {
      console.log(response);
      if(response.data.data.user.email!=null){
        this.user.email = response.data.data.user.email;
      }
      if(response.data.data.user.telephone!=null){
        this.user.telephone = response.data.data.user.telephone;
      }

      this.user.image = response.data.data.user.image;
      this.user.name = response.data.data.user.name;
      this.user.sno = response.data.data.user.sno;
      if(response.data.data.user.sex==1){
        this.user.sex = '女';
      } else {
        this.user.sex = '男';
      }
      this.user.school = response.data.data.user.school;
      this.user.exp = response.data.data.user.exp;
    })
  
    if(localStorage.getItem('isTeacher')=='1'){
      this.role = '老师';
    }else{
      this.role = '学生'
    }
  }

}
