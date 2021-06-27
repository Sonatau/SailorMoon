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
      //待定需要修改
      var api = '/course';//-------------------------后台接口
      var params = {        //-------------------------后台参数
        name: this.search_code,
        page: 1,
        isSelf: false
      }
      this.httpService.get(api, params).then(async (response: any) => {
        await loading.dismiss();
        // console.log(response);
        if(response.data.data.total == 0){
          let alert = await this.alertController.create({
            header: '提示',
            message: '班课不存在！',
            buttons: ['确定']
          });
          alert.present();
        }else{
          this.router.navigate(['/course/course-detail'], {queryParams:{code: this.search_code} });
        }
      });
    }
  }

}
