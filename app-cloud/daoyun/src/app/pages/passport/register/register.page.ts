import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public register_email: string = '';
  public register_password: string = '';
  public register_name: string = '';
  public register_no: string = '';
  public verify_password: string = '';
  public verify_code: string = '';
  public return_code = -1;  //1: 发送成功   -1: 发送失败
  public roleID: any; //1: 教师    2: 学生    0: 非法数据

  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }

  constructor(public httpService: HttpService,
    public http: HttpClient,
    public router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController:LoadingController,
  ) { }

  ngOnInit() {
  }

  //----------------------------------------------------------------------------------//
  //------------------------------------获取验证码-------------------------------------//
  //----------------------------------------------------------------------------------//
  onSendSMS() {
    //请求后台发送验证码
    if (this.verifyCode.disable == true) {
      this.verifyCode.disable = false;
      this.settime();
      var params = {
        email: this.register_email,
      };
      var api = '/sendCode';
      this.httpService.get_withoutToken(api, params).then((response: any) => {
        //console.log(response);
        this.return_code = response.data.respCode;
        // console.log(this.return_code);
      })
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
  //----------------------------------------------------------------------------------//
  //----------------------------------------------------------------------------------//

  //----------------------------------------------------------------------------------//
  //-----------------------------------提交注册信息------------------------------------//
  //----------------------------------------------------------------------------------//
  async onRegister(form: NgForm) {
    const loading = await this.loadingController.create({
      message: '请稍等...',
    });
    await loading.present();
    if(form.invalid){ //检验输入信息是否有效
      await loading.dismiss();
      let toast = await this.toastController.create({
        message: '请输入有效信息！',
        duration: 2000
      });
      toast.present();
    }else{
      if(this.return_code == -1){ //检验是否成功发送验证码
        await loading.dismiss();
        let toast = await this.toastController.create({
          message: '请先获取验证码！',
          duration: 2000
        });
        toast.present();
      }else{
        if (this.register_password != this.verify_password){
          await loading.dismiss();
          let toast = await this.toastController.create({
            message: '两次密码不一致！',
            duration: 2000
          });
          toast.present();
        }else{
          var api = '/register';
          var params = {
            email: this.register_email,
            password: this.register_password,
            name: this.register_name,
            sno: this.register_no,
            mailVerificationCode: this.verify_code,
            roleId: this.roleID
          }
          //console.log(params);
          this.httpService.post(api, params).then(async (response: any) => {
            await loading.dismiss();
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
                message: '注册成功！',
                buttons: [{
                  text: '确认',
                  cssClass: 'primary',
                        handler: (blah) => {
                          this.router.navigateByUrl('/login');
                        }
                }]
              });
              alert.present();
            }
          });
        }
      }
    }
  }


  //---------------没啥用标记着准备删掉---------------//
  // hasCode() {
  //   if (this.verify_code != null && this.return_code != null) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  //   //获取个人信息
  //   getInf(email) {
  //     var params = {//后台所需参数
  //       email: email,
  //     };
  //     var api = '/user/info';//后台接口
  //     this.httpService.get(api, params).then(async (response: any) => {
  //       if (response.status == 200) {
  //         console.log(response.data.role)//````````````````````````````````````
  //         localStorage.setItem("role", response.data.role);//```````````````````````````````````
  //       }
  //     })
  //   }
  // }
