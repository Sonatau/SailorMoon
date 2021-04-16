import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-find-by-email',
  templateUrl: './find-by-email.page.html',
  styleUrls: ['./find-by-email.page.scss'],
})
export class FindByEmailPage implements OnInit {

  public emailVerify: string = '';
  public verify_code: string = '';
  public return_code: string = '1';
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }
  constructor(public httpService: HttpService,
    public http: HttpClient, public router: Router,
    public alertController: AlertController,) {
  }

  ngOnInit() {

  }
  async onVerify(form: NgForm) {
    if (this.hasCode()) {
      if (form.valid) {
        //验证验证码是否正确
        // await this.onSendSMS();
        console.log(this.verify_code );
        console.log(this.return_code);
        if (this.verify_code == this.return_code) {
          localStorage.setItem("email",this.emailVerify);
          this.router.navigateByUrl('forget-password');
        } else {
          let alert = await this.alertController.create({
            header: '提示',
            message: '验证码不正确！',
            buttons: ['确定']
          });
          alert.present();
        }
      }
    }
  }

  onSendSMS() {
    //先验证账号存不存在
    var params = {//后台所需参数
      email: this.emailVerify,
    };
    var api = '/loginByCode';//后台接口
    this.httpService.post(api, params).then(async (response: any) => {
      if (response.data.role == "-1") {
        let alert = await this.alertController.create({
          header: '提示',
          message: '账号不存在!',
          buttons: ['确定']
        });
        alert.present();
      }  else if(response.data.respCode == "账号已被删除！"){
        let alert = await this.alertController.create({
          header: '提示',
          message: '该账号已被删除！',
          buttons: ['确定']
        });
        alert.present();
      }else {
        //账号存在请求后台数据 开始倒计时
        console.log(this.verifyCode.disable);
        if (this.verifyCode.disable == true) {
          var api = '/sendCode';//后台接口
          this.httpService.post(api, params).then((response: any) => {
            this.return_code = response.data.respCode;//返回参数
          })
        }
        this.verifyCode.disable = false;
        this.settime();
      }
    })

  }

  hasCode() {
    if (this.verify_code != null && this.return_code != null) {
      return true;
    } else {
      return false;
    }
  }
  settime() {
    if (this.verifyCode.countdown == 1) {
      this.verifyCode.countdown = 60;
      this.verifyCode.verifyCodeTips = "获取验证码";
      this.verifyCode.disable = true;
      return;
    } else {
      this.verifyCode.countdown--;
    }
    this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + "秒)";
    setTimeout(() => {
      this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + "秒)";
      this.settime();
    }, 1000);
  }

}
