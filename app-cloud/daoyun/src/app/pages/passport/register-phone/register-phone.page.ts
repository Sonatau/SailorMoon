import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register-phone',
  templateUrl: './register-phone.page.html',
  styleUrls: ['./register-phone.page.scss'],
})
export class RegisterPhonePage implements OnInit {

  public register_phone: string = '';
  public verify_code: string = '';
  public return_code: any;  //1: 发送成功   -1: 发送失败
  public roleID: any; //1: 教师    2: 学生    0: 非法数据

  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }

  public temp_name = "name_null";
  public temp_sno = -1;
  public temp_image = "image_null";

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
        phone: this.register_phone,
      };
      var api = '/send-message';
      // console.log(params);
      this.httpService.get_withoutToken(api, params).then((response: any) => {
        // console.log(response);
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
          var api = '/register-phone';//-------------------------后台接口
          var params = {        //-------------------------后台参数
            telephone: this.register_phone,
            verificationCode: this.verify_code,
            roleId: this.roleID,
            name: this.temp_name,
            sno: this.temp_sno,
            image: this.temp_image
          }
          // console.log(params);
          this.httpService.post_withoutToken(api, params).then(async (response: any) => {
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
                message: '注册成功！',
                buttons: [{
                  text: '确认',
                  cssClass: 'primary',
                  handler: (blah) => {
                    this.login();
                  }
                }]
              });
              alert.present();
            }
          });
        }
      }
    }

    async login() {
      const loading = await this.loadingController.create({
        message: '登陆中...',
      });
      var api = '/login-code';//后台接口
      var params = {//后台所需参数
        phone: this.register_phone,
        code: this.verify_code,
        device: 0
      };
      this.httpService.post_withoutToken(api, params).then(async (response: any) => {
        // console.log(response);
        this.return_code = response.data.respCode;
        // console.log(this.return_code);
        if(this.return_code == '1'){
          localStorage.setItem("token", response.data.data.token);
          if(response.data.data.role == '1') localStorage.setItem("isTeacher", '1');
          else localStorage.setItem("isTeacher", '0');
          if(response.data.data.admin.course == '1') localStorage.setItem("course-admin", '1');
          else localStorage.setItem("course-admin", '0');
          if(response.data.data.admin.checkin == '1') localStorage.setItem("checkin-admin", '1');
          else localStorage.setItem("checkin-admin", '0');
          localStorage.setItem("isLogin", "1");
          this.router.navigateByUrl('/tabs/course');
          this.setLoginTime();
        } else{
          await loading.dismiss();
          let alert = await this.alertController.create({
            header: '提示',
            message: '登录失败',
            buttons: ['确定']
          });
          alert.present();
        }
      })
    }
    
    setLoginTime() {
      let myDate = new Date();
      //获取当前年
      var year = myDate.getFullYear();
      //获取当前月
      var month = myDate.getMonth() + 1;
      //获取当前日
      var date = myDate.getDate();
      var h = myDate.getHours() < 10 ? '0' + myDate.getHours() : '' + myDate.getHours(); //获取当前小时数(0-23)
      var m = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : '' + myDate.getMinutes(); //获取当前分钟数(0-59)
      var s = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : '' + myDate.getSeconds();
      localStorage.setItem("loginTime", year + "/" + month + "/" + date + " " + h + ":" + m + ":" + s);
    }

  }

