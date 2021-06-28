import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-course-checkin',
  templateUrl: './course-checkin.page.html',
  styleUrls: ['./course-checkin.page.scss'],
})
export class CourseCheckinPage implements OnInit {

  public list = [];
  public page_max = 10;
  public page = 1;
  public total = 0;
  public flag = 0;//标记是否抓取完全

  public courseId;
  public courseCode;

  public checkinType = ['定位签到', '限时签到'];

  constructor(private loadingController: LoadingController,
    public httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------列表信息展示-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  ionViewWillEnter(){
    this.courseId = localStorage.getItem('courseId');
    this.courseCode = localStorage.getItem('courseCode');
    this.initData();
	}

  initData(){
    this.list = [];
    this.page = 1;
    this.total = 0;
    this.flag = 0;
    this.getCheckinList();
  }

  async getCheckinList() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    var params = {
      page: this.page,
      courseId: this.courseId
    }
    var api = '/attendance';
    this.httpService.get(api, params).then(async (response: any) => {
      await loading.dismiss();
      // console.log(response);
      if(response.data.data.list.length < this.page_max){
        this.flag = 1;
      }
      for(let i=0; i<response.data.data.list.length; i++){
        if(response.data.data.list[i].state!=0){
          this.list.push(response.data.data.list[i]);
          this.total = this.total + 1;
        }
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
        this.getCheckinList();
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

  gotoResult(index: number){
    this.router.navigate(['/checkin/checkin-result'], 
    {queryParams:{checkinId:this.list[index].id} });
  }

  returndetail(){
    this.router.navigate(['/course/course-detail'], 
    {queryParams:{code: this.courseCode} });
  }

}
