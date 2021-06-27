import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-member-checkin',
  templateUrl: './member-checkin.page.html',
  styleUrls: ['./member-checkin.page.scss'],
})
export class MemberCheckinPage implements OnInit {

  public stuId;
  public List = [];
  public total = 0;
  public checkinType = ['定位签到', '限时签到'];
  public state = ['','已签','','', '缺勤'];

  constructor(public activatedRoute: ActivatedRoute,
    public httpService: HttpService,
    public router: Router) { }

  ngOnInit() {
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------列表信息展示-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  ionViewWillEnter(){
    this.stuId = this.activatedRoute.snapshot.queryParams['stuId'];
    this.initList();
	}

  initList(){
    this.List = [];
    this.total = 0;
    this.getData();
  }
  
  async getData() {
    //获取
    var param = {
      courseId: localStorage.getItem('courseId')
    };
    var api = '/attendance-history';
    this.httpService.get(api, param).then(async (response: any) => {
      console.log(response);
      this.total = response.data.data.total;
      if(response.data.data.total!=0){
        // for(let i=0; i<this.total; i++){
        //   this.List.push({
        //   })
        // }
        this.List = response.data.data.list;
      }
    });
  }

  gotoMemberList(){
    this.router.navigate(['/member-list']);
  }

}

