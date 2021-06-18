import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpService } from '../shared/services/http.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public flag: any;

  constructor(private alertController: AlertController,
    public router: Router,
    public httpService: HttpService) {}

  ionViewWillEnter(){
    this.checkUserInfo();
  }

  async warning(){
    let alert = await this.alertController.create({
      header: '提示',
      message: '请先补充个人信息！',
      buttons: [{
        text: '确认',
        cssClass: 'primary',
        handler: (blah) => {
          this.router.navigateByUrl('/mine/edit-usermsg');
        }
      }],
      backdropDismiss: false
    });
    alert.present();
  }

  checkUserInfo(){
    var api = '/userinfo';//后台接口
    var params = { };
    this.httpService.get(api, params).then(async (response: any) => {
      console.log(response);
      if(response.data.data.user.name == 'name_null'){
        this.warning();
      }
    })
  }

}
