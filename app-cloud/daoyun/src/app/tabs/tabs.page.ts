import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public flag: any;

  constructor(private alertController: AlertController,
    public router: Router) {}

  ionViewWillEnter(){
    this.flag = localStorage.getItem("isQuik");
    if(this.flag == '1'){
      this.warning();
    }
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

}
