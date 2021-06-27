import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavParams } from '@ionic/angular';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-search-course',
  templateUrl: './search-course.component.html',
  styleUrls: ['./search-course.component.scss'],
})
export class SearchCourseComponent implements OnInit {

  public isTeacher: any;
  public target = "";

  public list = [];
  public page_max = 10;
  public page = 1;
  public total = 0;
  public flag = 0;//标记当前用户的班课是否抓取完全

  constructor(public navParams: NavParams, public router: Router,
    public httpService: HttpService,
    public http: HttpClient, 
    public loadingController: LoadingController) {
  }

  ngOnInit() {
    this.initData();
    // console.log("search-ngOnInit");
  }

  dissmissSearch() {
    this.navParams.data.modal.dismiss();
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------根据用户输入搜索---------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  getData($event) {
    this.initData();
    this.target = $event.detail.value;
    this.getCourse();
    // console.log("search-getData");
  }

  getCourse() {
    var params = {
      page: this.page,
      name: this.target,
      isSelf: false
    }
    var api = '/course';
    this.httpService.get(api, params).then(async (response: any) => {
      console.log(response);
      if(response.data.respCode==-1){
        this.total = 0;
        this.flag = 1;
      }else{
        this.total = response.data.data.total;
        if(response.data.data.list.length < this.page_max){
          this.flag = 1;
        }
        for(let i=0; i<response.data.data.list.length; i++){
          this.list.push(response.data.data.list[i]);
        }
      }
    })
  }

//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------列表信息展示-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  ionViewWillEnter(){
    this.initData();
    this.getCourse();
    // console.log("search-ionViewWillEnter");
	}

  initData(){
    this.list = [];
    this.page = 1;
    this.total = 0;
    this.flag = 0;
    this.target = "";
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
    this.getCourse();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------跳转--------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//

  gotodetail(index: number){
    this.dissmissSearch();
    this.router.navigate(['/course/course-detail'], {queryParams:{code: this.list[index].code} });
  }

}
