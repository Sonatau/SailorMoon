import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public tab = "tab1";
  public login_email: string = '';
  public login_phone: string = '';
  public login_password: string = '';
  public verify_code: string = '';
  public return_code: any;  //1: 发送成功   -1: 发送失败
  public github_code: string;

  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }

  constructor(public httpService: HttpService,
    public http: HttpClient, public router: Router,
    public alertController: AlertController,
    private toastController: ToastController,
    private inAppBrowser: InAppBrowser,
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController) {
    //登录状态为1时自动登录
    if (localStorage.getItem("isLogin") == "1") {
      if (this.isOverTime() == false) {
        this.router.navigateByUrl('/tabs/course');
      }
    }
  }

  ionViewWillEnter() {
    this.github_code = this.activatedRoute.snapshot.queryParams.code;
    console.log(this.github_code)
    if(this.github_code != null){
      var api = 'http://192.168.43.225:8080/login-github';
      var params = {//后台所需参数
          code: this.github_code
      };
      console.log(params);
      //post_withoutToken
      this.httpService.post_byURL(api, params).then((response: any) => {
        console.log(response);
        this.return_code = response.data.respCode;
        if(this.return_code == '1'){
          localStorage.setItem("token", response.data.data.token);
          if(response.data.data.role == '1') localStorage.setItem("isTeacher", '1');
          else localStorage.setItem("isTeacher", '0');
          if(response.data.data.admin.course == '1') localStorage.setItem("course-admin", '1');
          else localStorage.setItem("course-admin", '0');
          if(response.data.data.admin.checkin == '1') localStorage.setItem("checkin-admin", '1');
          else localStorage.setItem("checkin-admin", '0');
          this.router.navigateByUrl('/tabs/course');
          localStorage.setItem("isLogin", "1");
          this.setLoginTime();
        } else{
          // console.log('当前github账户未注册，请先注册！');
          // this.router.navigateByUrl('/register');
          console.log('github链接超时！');
        }
      })
    }
  }

  ngOnInit() {
  }

  //----------------------------------------------------------------------------------//
  //------------------------------------获取验证码-------------------------------------//
  //----------------------------------------------------------------------------------//
  onSendMsg() {
    //请求后台发送手机验证码
    if (this.verifyCode.disable == true) {
      this.verifyCode.disable = false;
      this.settime();
      var params = {
        phone: this.login_phone,
      };
      var api = '/send-message';
      this.httpService.get_withoutToken(api, params).then((response: any) => {
        console.log(response);
        this.return_code = response.data.respCode;
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
    var params: any;
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
        params = {//后台所需参数
          phone: this.login_phone,
          code: this.verify_code,
          device: 0
        };
      } else if (this.tab == 'tab1'){//密码登录
        var api = '/login';//后台接口
        params = {//后台所需参数
          email: this.login_email,
          password: this.login_password,
          device: 0
        };
      }
      this.httpService.post_withoutToken(api, params).then(async (response: any) => {
        console.log(response);
        this.return_code = response.data.respCode;
        console.log(this.return_code);
        if(this.return_code == '1'){
          localStorage.setItem("token", response.data.data.token);
          if(response.data.data.role == '1') localStorage.setItem("isTeacher", '1');
          else localStorage.setItem("isTeacher", '0');
          if(response.data.data.admin.course == '1') localStorage.setItem("course-admin", '1');
          else localStorage.setItem("course-admin", '0');
          if(response.data.data.admin.checkin == '1') localStorage.setItem("checkin-admin", '1');
          else localStorage.setItem("checkin-admin", '0');
          this.router.navigateByUrl('/tabs/course');
          localStorage.setItem("isLogin", "1");
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
  }
  //----------------------------------------------------------------------------------//
  //----------------------------------------------------------------------------------//

  //----------------------------------------------------------------------------------//
  //-----------------------------------GitHub登录-------------------------------------//
  //----------------------------------------------------------------------------------//
  loginByGitHub(){
    //const GitHubURL = this.inAppBrowser.create('https://github.com/login/oauth/authorize?client_id=58d1213474db1685dec2&redirect_uri=http://localhost:8100/login');
    const GitHubURL = this.inAppBrowser.create('https://gitee.com/oauth/authorize?client_id=f932d5da2a36977bd4fc7b61df56aaa31764c8ad195c63c34e4b21e825f3df87&redirect_uri=http://localhost:8100/login&response_type=code')
    GitHubURL.show();
  }
  //----------------------------------------------------------------------------------//
  //----------------------------------------------------------------------------------//

}
