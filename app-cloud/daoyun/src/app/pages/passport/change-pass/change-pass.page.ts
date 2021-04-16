import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.page.html',
  styleUrls: ['./change-pass.page.scss'],
})
export class ChangePassPage implements OnInit {

  public changeinf = {
    oldpassword: '',
    password1: '',
    password2: ''
  }
  constructor(private toastController:ToastController,
    public httpService: HttpService, 
    public alertController: AlertController,
    public http: HttpClient,
    public router: Router) { }

  ngOnInit() {
  }

  async onChangePass() {
    //两次新密码是否相同
    if (this.changeinf.password1 == this.changeinf.password2) {
      var api = '/updated-password';
      var params = {
        newPassword1:this.changeinf.password1,
        newPassword2:this.changeinf.password2,
        oldPassword: this.changeinf.oldpassword,
      };
      this.httpService.put(api, params).then(async (response: any) => {
        //console.log(response);
        if(response.data.respCode == 1){
          //修改密码成功，跳转到登录页
          let alert = await this.alertController.create({
            header: '提示',
            message: '修改成功，点击返回登录！',
            buttons: [{
              text: '确定',
              cssClass: 'primary',
              handler: (blah) => {
                //修改密码成功，跳转到登录页
                this.router.navigateByUrl('/login');
              }
            }]
          });
          alert.present();
        }else{
          let alert = await this.alertController.create({
            header: '提示',
            message: '密码修改失败！',
            buttons: ['确定']
          });
          alert.present();
        }
      })
    }else{
      let toast = await this.toastController.create({
        message: '两次新密码输入不一致！',
        duration: 2000
      });
      toast.present();
    }
  }
}
