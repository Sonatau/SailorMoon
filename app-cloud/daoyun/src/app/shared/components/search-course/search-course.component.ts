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

  public courseType: string;
  public isTeacher: any;
  public searchType = "";
  public target = "";

  public list = [];
  public page_max = 10;
  public page = 1;
  public total = 0;
  public flag = 0;//标记当前用户的课程是否抓取完全

  public params;

  constructor(public navParams: NavParams, public router: Router,
    public httpService: HttpService,
    public http: HttpClient, 
    public loadingController: LoadingController) {
      this.isTeacher = localStorage.getItem("isTeacher");
      if (this.isTeacher == 1) {
        this.courseType = '我创建的';
      } else {
        this.courseType = '我加入的';
      }
  }

  ngOnInit() {}

  dissmissSearch() {
    this.navParams.data.modal.dismiss();
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------根据用户输入搜索---------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  getData($event) {
    this.initData();
    if(isNaN($event.detail.value)==true){//存在数字外的字符
      this.searchType = "name";
    } else {  //输入的是纯数字
      this.searchType = "code";
    }
    this.target = $event.detail.value;
    this.getCourse();
  }

  getCourse() {
    if(this.searchType == "name"){
      this.params = {
        page: this.page,
        name: this.target
      }
    } else if (this.searchType == "code"){
      this.params = {
        page: this.page,
        code: this.target
      }
    } else {
      this.params = {
        page: this.page
      }
    }
    var api = '/course';
    this.httpService.get(api, this.params).then(async (response: any) => {
      console.log(response);
      this.total = response.data.data.total;
      if(response.data.data.list.length < this.page_max){
        this.flag = 1;
      }
      for(let i=0; i<response.data.data.list.length; i++){
        this.list.push(response.data.data.list[i]);
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
    this.searchType = "";
    this.target = "";
    this.getCourse();
	}

  initData(){
    this.list = [];
    this.page = 1;
    this.total = 0;
    this.flag = 0;
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
