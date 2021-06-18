import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-join-by-code',
  templateUrl: './join-by-code.page.html',
  styleUrls: ['./join-by-code.page.scss'],
})
export class JoinByCodePage implements OnInit {

  public search_code = "";

  constructor(
    public router: Router,
    public httpService: HttpService,
    public http: HttpClient,
    private loadingController:LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
  }
  
  async onSubmit(form: NgForm) {
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
      var api = '/course-member';//-------------------------后台接口
      var params = {        //-------------------------后台参数
        code: this.search_code
      }
      this.httpService.post_params(api, params).then(async (response: any) => {
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
          // let alert = await this.alertController.create({
          //   header: '提示',
          //   message: '加入成功！',
          //   buttons: [{
          //     text: '确认',
          //     cssClass: 'primary',
          //           handler: (blah) => {
                      this.router.navigate(['/course/course-detail'], {queryParams:{code: this.search_code} });
                      localStorage.setItem("inCourse", "0");
          //           }
          //   }]
          // });
          // alert.present();
        }
      });
    }
  }

}

// let alert = await this.alertController.create({
//   header: '提示',
//   message: '加入成功！',
//   buttons: [{
//     text: '确认',
//     cssClass: 'primary',
//           handler: (blah) => {
//             this.router.navigate(['/course/course-detail'], {queryParams:{code: this.search_code} });
//           }
//   }]
// });
// alert.present();
