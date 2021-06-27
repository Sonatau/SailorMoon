import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, PickerController, ToastController } from '@ionic/angular';
import { EventService } from 'src/app/shared/services/event.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { PickerService } from 'src/app/shared/services/picker.service';

@Component({
  selector: 'app-edit-usermsg',
  templateUrl: './edit-usermsg.page.html',
  styleUrls: ['./edit-usermsg.page.scss'],
})
export class EditUsermsgPage implements OnInit {

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
  schoolList = {
    total: 0,
    options: []
  }
  public schoolChoosed = {
    name: '请选择',
    id: -1
  }
  public over = false;
  public role;

  constructor(public httpService: HttpService,
    private alertController: AlertController,
    public pickerService: PickerService,
    private toastController: ToastController,
    private router: Router,
    public eventService: EventService
    ) { }

  ngOnInit() {
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------------页面信息展示----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  ionViewWillEnter(){
    this.initUserInfo();
  }

  ionViewWillLeave(){
    this.eventService.eventEmit.emit('user-detail-change','用户详情页返回');

  }

  initUserInfo(){
    //getUserInfo
    var api = '/userinfo';//后台接口
    var params = { };
    this.httpService.get(api, params).then(async (response: any) => {
      console.log(response);
      this.user.image = response.data.data.user.image;
      if(response.data.data.user.name != "name_null"){
        this.user.name = response.data.data.user.name;
        this.over = true;
      }else{
        this.over = false;
      }
      if(response.data.data.user.sno != "-1"){
        this.user.sno = response.data.data.user.sno;
      }
      this.user.sex = response.data.data.user.sex;
      if(response.data.data.user.schoolId != null){
        this.schoolChoosed.name = response.data.data.user.school;
        this.schoolChoosed.id = response.data.data.user.schoolId;
      }
    })
    //getSchoolList
    this.getSchoolList();
    this.user.password = null;
    if(localStorage.getItem('isTeacher')=='1'){
      this.role = '老师';
    }else{
      this.role = '学生'
    }
  }

  getSchoolList(){
    var param = {
      page: 1
    };
    var api = '/school';
    this.httpService.get(api, param).then(async (response: any) => {
      for (let i = 0; i < response.data.data.total; i++) {
        this.schoolList.options.push({
          id: response.data.data.list[i].id,
          name: response.data.data.list[i].name
        })
      }
      this.schoolList.total = response.data.data.total;
    })
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------请求学校列表-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  async openPicker() {
    this.schoolChoosed = await this.pickerService.createPicker(this.schoolList);
    console.log(this.schoolChoosed);
  }

async onSubmit(form: NgForm) {
  if (form.valid) {
    if(this.user.name=="name_null" || this.user.sno=="-1"){
      let toast = await this.toastController.create({
        message: '名字、学号/工号为必填项目！',
        duration: 2000
      });
      toast.present();
    } else if(this.user.password==null && this.over==false){
      let toast = await this.toastController.create({
        message: '初次登录必须补全密码！',
        duration: 2000
      });
      toast.present();
    } else {
      if(this.over==false){
        var param = {
          image: this.user.image,
          name: this.user.name,
          schoolId: this.schoolChoosed.id,
          sno: this.user.sno,
          sex: this.user.sex,
          password: this.user.password 
        };
        this.putUserInfo(param);
      } else {
        var param_over = {
          image: this.user.image,
          name: this.user.name,
          schoolId: this.schoolChoosed.id,
          sno: this.user.sno,
          sex: this.user.sex,
        };
        this.putUserInfo(param_over);
      }
    }
  }
}

  putUserInfo(param: any){
    var api = '/userinfo';
    console.log(param);
    this.httpService.put(api, param).then(async (response: any) => {
      console.log(response);
      if(response.data.respCode!=-1){
        const alert = await this.alertController.create({
          message: '用户信息修改成功！',
          buttons: [
            {
              text: '确认',
              cssClass: 'secondary',
              handler: (blah) => {
                this.router.navigate(['/mine/usermsg']);
              }
            }
          ]
        });
        await alert.present();
      }
    });
  }
}