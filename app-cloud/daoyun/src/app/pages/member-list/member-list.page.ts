import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.page.html',
  styleUrls: ['./member-list.page.scss'],
})
export class MemberListPage implements OnInit {

  public lesson = {
    no: '888888',
    name: '工程训练'
  };
  public isNo = '1';
  public member = [];
  public isTeacher: any;
  public memberNo: any = 0;
  public rank: any;
  public my_exp: any;
  public flag: any = '0';
  constructor(public modalController: ModalController,
    private router: Router,
    public httpService: HttpService,
    public http: HttpClient,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public toastController: ToastController,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.isFlash == '1') {
        this.getdata();
      }
    })
  }
  ngOnInit() {
    this.getdata();
  }
  ionViewWillEnter() {
    this.getdata();
  }
  async getdata() {
    // this.lesson.name = localStorage.getItem("lesson_name");
    // this.lesson.no = localStorage.getItem("lesson_no");
    this.isTeacher = localStorage.getItem("isTeacher");

    if (this.isTeacher == '1') {
      this.orderByNo();
    } else {
      this.orderByExp();
    }

    //个人排名与经验值
    var params = {
      code: localStorage.getItem("lesson_no"),
      order: "0",//按经验值顺序显示
      email: localStorage.getItem("email")
    }
    var api = '/courses/member';//后台接口
    this.httpService.get(api, params).then(async (response: any) => {
      this.rank = response.data.rank;
      this.my_exp = response.data.exp;
    })
  }
  async orderByNo() {
    this.isNo = '0';
    localStorage.setItem("isNo", "1");
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    //按学号排序List
    var params = {
      code: localStorage.getItem("lesson_no"),
      order: "1"//按学号顺序显示
    }
    var api = '/courses/member';//后台接口
    this.httpService.get(api, params).then(async (response: any) => {
      await loading.dismiss();
      if (response.data.respCode == "该班课没有学生") {
        this.flag = '0';
      } else {
        this.flag = '1';
        this.member = response.data;
        this.memberNo = this.member.length;
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
  async orderByExp() {
    this.isNo = '1';
    localStorage.setItem("isNo", "0");
    //按经验值排序list
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();//加载

    var params = {
      code: localStorage.getItem("lesson_no"),
      order: "0"//按经验值顺序显示
    }
    var api = '/courses/member';//后台接口
    this.httpService.get(api, params).then(async (response: any) => {

      await loading.dismiss();
      if (response.data.respCode == "该班课没有学生") {
        this.flag = '0';
      } else {
        this.flag = '1';
        this.member = response.data;
        this.memberNo = this.member.length;
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
  // async searchMember() {
  //   //弹出搜索模态框
  //   const modal = await this.modalController.create({
  //     component: SearchMemberComponent,
  //     componentProps: {
  //       type: '按照姓名、学号检索'
  //     }
  //   });
  //   await modal.present();
  // }
  gotoCheck() {
    this.router.navigateByUrl('student-checkin');
  }
}
