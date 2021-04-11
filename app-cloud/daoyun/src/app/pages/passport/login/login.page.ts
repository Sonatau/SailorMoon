import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public tab = "tab1";
  public result: string;
  login = {
    email: '',
    password: ''
  }
  public verify_code: string = '';
  public return_code: string = '1';
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }

  constructor(public httpService: HttpService,
    public http: HttpClient, public router: Router,
    public alertController: AlertController,
    // private iab: InAppBrowser,
    public loadingController: LoadingController) {
    //登录状态为1时自动登录
    if (localStorage.getItem("isLogin") == "1") {
      if (this.isOverTime()) {
        this.router.navigateByUrl('\lesson-tabs');
      }
    }
  }

  ngOnInit() {
  }

  async onLogin(form: NgForm) {
    if (form.valid) {
      var params;
      const loading = await this.loadingController.create({
        message: '登录中...',
      });
      // await loading.present();
      // if (this.tab == 'tab2') {//验证码登录
      //   //点击获取验证码后，进入获取验证码界面 
      //   params = {//后台所需参数
      //     email: this.login.email
      //   };
      //   var api = '/loginByCode';//后台接口
      //   this.httpService.post(api, params).then(async (response: any) => {
      //     this.result = response.data.role;
      //     await loading.dismiss();
      //     if (response.data.role == "-1") {
      //       let alert = await this.alertController.create({
      //         header: '提示',
      //         message: '账号不存在！',
      //         buttons: ['确定']
      //       });
      //       alert.present();
      //     } else if (response.data.respCode == "账号已被删除！") {
      //       let alert = await this.alertController.create({
      //         header: '提示',
      //         message: '该账号已被删除！',
      //         buttons: ['确定']
      //       });
      //       alert.present();
      //     } else {
      //       this.router.navigateByUrl(`/verify/${this.login.email}`);
      //       localStorage.setItem("email", this.login.email);
      //       // this.getInf(this.login.email);
      //       this.setTime();
      //     }
      //   })
      // } else {//密码登录
      //   params = {//后台所需参数
      //     email: this.login.email,
      //     password: this.login.password
      //   };
      //   //将账号密码传给后台，得到返回值，若匹配无误，则进入班课列表界面
      //   var api = '/loginByPassword';//后台接口

      //   this.httpService.post(api, params).then(async (response: any) => {
      //     console.log(response);
      //     await loading.dismiss();
      //     this.result = response.data.respCode;
      //     if (this.result == "1") {
      //       //获取该user的信息（teacher_id,student_id）

      //       localStorage.setItem("token", response.data.token);
      //       localStorage.setItem("email", response.data.email);
      //       // localStorage.setItem("email", this.login.email);
      //       localStorage.setItem("isLogin", "1");
      //       this.getInf(response.data.email);
      //       this.setTime();

      //     } else {
      //       let alert = await this.alertController.create({
      //         header: '提示',
      //         message: '用户名或者密码不正确',
      //         buttons: ['确定']
      //       });
      //       alert.present();
      //     }
      //   })
      // }
    }
  }

  //获取个人信息
  getInf(email) {
    var params = {//后台所需参数
      email: email,
    };
    var api = '/user/info';//后台接口
    this.httpService.get(api, params).then(async (response: any) => {
      if (response.status == 200) {
        localStorage.setItem("role", response.data.role);
        if (localStorage.getItem("role") != null) {
          this.router.navigateByUrl('/lesson-tabs/mylesson');
        }

      }
    })
  }

  setTime() {
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
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    // //计算出小时数
    // var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
    // var hours=Math.floor(leave1/(3600*1000))
    // //计算相差分钟数
    // var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
    // var minutes=Math.floor(leave2/(60*1000))
    // //计算相差秒数
    // var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    // var seconds=Math.round(leave3/1000)
    // alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")

    if (days > 30) {
      return false;
    } else {
      return true;
    }

  }

}
