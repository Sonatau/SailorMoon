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
    // console.log('inTabs_willEnter');
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
      // console.log(response);
      localStorage.setItem('UserId', response.data.data.user.id);
      if(response.data.data.user.name=='name_null' || response.data.data.respCode==-1){
        this.warning();
      }
    })
  }

}
