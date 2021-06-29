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
  public failList = [];
  public failTotal = 0;
  public successList = [];
  public successTotal = 0;
  public noList = [];
  public noTotal = 0;
  public checkinType = ['定位签到', '限时签到'];

  constructor(public activatedRoute: ActivatedRoute,
    public httpService: HttpService,
    public router: Router) { }

  ngOnInit() {
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------列表信息展示-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  ionViewWillEnter(){
    this.stuId = localStorage.getItem('UserId');
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
      courseId: localStorage.getItem('courseId')
    };
    var api = '/attendance-history';
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

  gotoMemberList(){
    this.router.navigate(['/member-list']);
  }

}

