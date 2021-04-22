import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public tab = "tab1";
  public login_email: string = '';
  public login_password: string = '';
  public verify_code: string = '';
  public return_code = -1;  //1: 发送成功   -1: 发送失败

  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }

  constructor(public httpService: HttpService,
    public http: HttpClient, public router: Router,
    public alertController: AlertController,
    private toastController: ToastController,
    // private iab: InAppBrowser,
    public loadingController: LoadingController) {
    //登录状态为1时自动登录
    if (localStorage.getItem("isLogin") == "1") {
      if (this.isOverTime() == false) {
        this.router.navigateByUrl('/tabs/coures');
      }
    }
  }

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
        email: this.login_email,
      };
      var api = '/sendCode';
      this.httpService.get_withoutToken(api, params).then((response: any) => {
        //console.log(response);
        this.return_code = response.data.respCode;
        //console.log(this.return_code);
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
  //-----------------------------------是否需要登录------------------------------------//
  //----------------------------------------------------------------------------------//
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

  isOverTime() {
    let endDate = new Date();
    let startDate = localStorage.getItem("loginTime");
    //时间差的毫秒数 
    let date3 = endDate.getTime() - new Date(startDate).getTime();
    var hours=Math.floor(date3/(3600*1000));//计算小时数
    //计算出相差天数
    //var days = Math.floor(date3 / (24 * 3600 * 1000));
    //计算出小时数
    //var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
    //var hours=Math.floor(leave1/(3600*1000))
    // //计算相差分钟数
    // var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
    // var minutes=Math.floor(leave2/(60*1000))
    // //计算相差秒数
    // var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    // var seconds=Math.round(leave3/1000)
    // alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
    if (hours > 2) return true;
    else return false;
  }
  //----------------------------------------------------------------------------------//
  //----------------------------------------------------------------------------------//

  //----------------------------------------------------------------------------------//
  //-------------------------------------验证登录--------------------------------------//
  //----------------------------------------------------------------------------------//
  async onLogin(form: NgForm) {
    const loading = await this.loadingController.create({
      message: '登陆中...',
    });
    if(form.invalid){ //检验输入信息是否有效
      await loading.dismiss();
      let toast = await this.toastController.create({
        message: '请输入有效信息！',
        duration: 2000
      });
      toast.present();
    }else{
      if (this.tab == 'tab2') {//验证码登录
        var api = '/login-code';//后台接口
        var params_tab2 = {//后台所需参数
          email: this.login_email,
          mailVerificationCode: this.verify_code
        };
        this.httpService.post_withoutToken(api, params_tab2).then(async (response: any) => {
          this.return_code = response.data.respCode;
          if(this.return_code == 1){
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("isTeacher", response.data.data.isTeacher);
            localStorage.setItem("Adimn", response.data.data.admin);
          }
        })
      } else {//密码登录
        var api = '/login';//后台接口
        var params_tab1 = {//后台所需参数
          email: this.login_email,
          password: this.login_password
        };
        console.log(params_tab1);
        this.httpService.post_withoutToken(api, params_tab1).then(async (response: any) => {
          console.log(response);
          this.return_code = response.data.respCode;
          if(this.return_code == 1){
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("isTeacher", response.data.data.isTeacher);
            localStorage.setItem("Adimn", response.data.data.admin);
          }
        })
      }
      await loading.dismiss();
      if (this.return_code == -1) {
        let alert = await this.alertController.create({
          header: '提示',
          message: '登录失败',
          buttons: ['确定']
        });
        alert.present();
      } else {
        console.log('login_test:success!');
        this.router.navigateByUrl('/tabs/coures');
        localStorage.setItem("isLogin", "1");
        this.setLoginTime();
      }
    }
  }
  //----------------------------------------------------------------------------------//
  //----------------------------------------------------------------------------------//

}
