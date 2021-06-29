import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SearchCourseComponent } from 'src/app/shared/components/search-course/search-course.component';
import { EventService } from 'src/app/shared/services/event.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.page.html',
  styleUrls: ['./course.page.scss'],
})
export class CoursePage implements OnInit {

  public isTeacher: any;

  public list = [];
  public page_max = 10;
  public page = 1;
  public total = 0;
  public flag = 0;//标记当前用户的班课是否抓取完全
  public return_flag = 0;

  constructor(public httpService: HttpService,
    public http: HttpClient,
    public modalController: ModalController,
    public router: Router,
    public actionSheetController: ActionSheetController,
    public loadingController: LoadingController,
    private barcodeScanner: BarcodeScanner,
    public eventService: EventService) { 
      this.eventService.eventEmit.on('detail-change',()=>{
        // console.log('course-eventListener');
        this.initData();
        this.return_flag = 1;
      })
    }

  ngOnInit() {
    this.isTeacher = localStorage.getItem("isTeacher");
    // console.log('course-ngOnInit');
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------列表信息展示-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  ionViewWillEnter(){
    if(this.return_flag==0){
      this.initData();
    }
    // console.log('course-ionViewWillEnter');
	}

  initData(){
    this.list = [];
    this.page = 1;
    this.total = 0;
    this.flag = 0;
    this.getCourse();
  }

  async getCourse() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    var params = {
      page: this.page,
      isSelf: true
    }
    var api = '/course';
    this.httpService.get(api, params).then(async (response: any) => {
      await loading.dismiss();
      // console.log(response);
      this.total = response.data.data.total;
      if(response.data.data.list.length < this.page_max){
        this.flag = 1;
      }
      for(let i=0; i<response.data.data.list.length; i++){
        this.list.push(response.data.data.list[i]);
      }
    }).catch(async function (error) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: '警告',
        message: '请求失败！',
        buttons: ['确认']
      });
      await alert.present();
    })
  }

  loadData(event) {
    setTimeout(() => {
      if (this.flag==1) {
        event.target.disabled = true;
      } else {
        this.page = this.page + 1;
        this.getCourse();
      }
      event.target.complete();
    }, 500);
  }

  doRefresh(event) {
    this.initData();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

//---------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------一些跳转&搜索----------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//

  async search(type) {
    //弹出搜索模态框
    const modal = await this.modalController.create({
      component: SearchCourseComponent,
      componentProps: {
        type: type
      }
    });
    await modal.present();
  }

  async AddorCreate() {
    if (this.isTeacher == 1) {//教师
      const actionSheet = await this.actionSheetController.create({
        mode: "ios",
        buttons: [
          {
            text: '创建班课',
            handler: () => {
              this.router.navigateByUrl('/course/create-course');
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
            text: '使用班课号加入班课',
            handler: () => {
              this.router.navigateByUrl('/course/join-by-code');
            }
          },
          {
            text: '使用二维码加入班课',
            handler: () => {
              this.onScan();
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

  gotodetail(index: number){
    this.router.navigate(['/course/course-detail'], {queryParams:{code: this.list[index].code} });
  }

//---------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------扫码加入！！！----------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//

  onScan() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.router.navigate(['/course/course-detail'], {queryParams:{code: barcodeData.text} });
    }).catch(err => {
      console.log('Error', err);
    });
  }

}
