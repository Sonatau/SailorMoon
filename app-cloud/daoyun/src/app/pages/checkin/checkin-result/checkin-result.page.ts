import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-checkin-result',
  templateUrl: './checkin-result.page.html',
  styleUrls: ['./checkin-result.page.scss'],
})
export class CheckinResultPage implements OnInit {

  public checkinId;
  public failList = [];
  public failTotal = 0;
  public successList = [];
  public successTotal = 0;
  public noList = [];
  public noTotal = 0;
  public timeNow;

  constructor(public activatedRoute: ActivatedRoute,
    public httpService: HttpService,
    public router: Router,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController) { }

  ngOnInit() {
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------列表信息展示-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  ionViewWillEnter(){
    this.checkinId = this.activatedRoute.snapshot.queryParams['checkinId'];
    this.initList();
	}

  initList(){
    this.failList = [];
    this.failTotal = 0;
    this.successList = [];
    this.successTotal = 0;
    this.noList = [];
    this.noTotal = 0;
    this.getData();
  }
  
  async getData() {
    //获取
    var param = {
      attendanceId: this.checkinId,
      realTime: false
    };
    var api = '/attendance-result';
    this.httpService.get(api, param).then(async (response: any) => {
      // console.log(response);
      this.successList = response.data.data.success;
      this.successTotal = response.data.data.success.length;
      this.failList = response.data.data.fail;
      this.failTotal = response.data.data.fail.length;
      this.noList = response.data.data.no;
      this.noTotal = response.data.data.no.length;
    });
  }

  gotoCheckinList(){
    this.router.navigate(['/checkin/course-checkin']);
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------修改签到状态-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  async makeSuccess(index: number, type:string){
    if(type=='no'){
      const actionSheet = await this.actionSheetController.create({
        mode: "ios",
        buttons: [
          {
            text: '手动补签',
            handler: () => {
              this.timeNow = this.getTimeStr(Date.now()/1000);
              var param = {
                studentId: this.noList[index].id,
                attendanceId: this.checkinId,
                state: 0,
                attendanceTimeStr: this.timeNow
              }
              var api = '/attendance-result';
              this.httpService.post_data(api, param).then(async (response: any) => {
                // console.log(response);
                if(response.data.respCode!=-1){
                  let toast = await this.toastController.create({
                    message: '记录出勤成功！',
                    duration: 2000
                  });
                  toast.present();
                  this.initList();
                } else {
                  let toast = await this.toastController.create({
                    message: '记录出勤失败！',
                    duration: 2000
                  });
                  toast.present();
                }
              });
            }
          },
          {
            text: '取消',
            role: 'destructive'
          }
        ]
      });
      await actionSheet.present();
    } else {
      const actionSheet = await this.actionSheetController.create({
        mode: "ios",
        buttons: [
          {
            text: '手动补签',
            handler: () => {
              var param = {
                id: this.failList[index].attendanceResultId,
                studentId: this.failList[index].id,
                attendanceId: this.checkinId,
                state: 0
              }
              this.putState(param, '出勤');
            }
          },
          {
            text: '取消',
            role: 'destructive'
          }
        ]
      });
      await actionSheet.present();
    }
  }

  async makeFail(index: number){
    const actionSheet = await this.actionSheetController.create({
      mode: "ios",
      buttons: [
        {
          text: '记录缺勤',
          handler: () => {
            var param = {
              id: this.successList[index].attendanceResultId,
              studentId: this.successList[index].id,
              attendanceId: this.checkinId,
              state: 1
            }
            this.putState(param, '缺勤');
          }
        },
        {
          text: '取消',
          role: 'destructive'
        }
      ]
    });
    await actionSheet.present();
  }

  putState(param: any, option: string){
    var api = '/attendance-result';
    this.httpService.put(api, param).then(async (response: any) => {
      // console.log(response);
      if(response.data.respCode!=-1){
        let toast = await this.toastController.create({
          message: '记录'+option+'成功！',
          duration: 2000
        });
        toast.present();
        this.initList();
      } else {
        let toast = await this.toastController.create({
          message: '记录'+option+'失败！',
          duration: 2000
        });
        toast.present();
      }
    });
  }

  getTimeStr(timestamp){
    var time = new Date(timestamp*1000);
    var date = ((time.getFullYear())  + "-" +
                (time.getMonth()+1).toString().padStart(2,'0') + "-" +
                (time.getDate()).toString().padStart(2,'0') + " " +
                (time.getHours()).toString().padStart(2,'0') + ":" +
                (time.getMinutes()).toString().padStart(2,'0') + ":" +
                (time.getSeconds()).toString().padStart(2,'0')
               );
    return date;
  }
  
}
