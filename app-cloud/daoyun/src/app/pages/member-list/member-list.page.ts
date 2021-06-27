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

  public course = {
    id: -1,
    name: '',
    code: '',
  };
  public isNo = '1';
  public isTeacher: any;
  public memberList = [];
  public memberNum: any = 0;

  public stu_rank: any;
  public stu_exp: any;

  constructor(public modalController: ModalController,
    private router: Router,
    public httpService: HttpService,
    public http: HttpClient,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public toastController: ToastController,
    private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    this.isTeacher = localStorage.getItem("isTeacher");
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------列表信息展示-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  ionViewWillEnter(){
    this.course.code = localStorage.getItem('courseCode');
    this.course.id = Number(localStorage.getItem('courseId'));
    this.course.name = localStorage.getItem('courseName');
    this.initList();
    if(this.isTeacher=='0'){
      this.initSelf();
    }
    console.log('member-ionViewWillEnter');
	}

  initList(){
    this.memberList = [];
    this.memberNum = 0;
    this.getmember();
  }

  initSelf(){

  }
  
  async getmember() {
    //获取
    var param = {
      courseId: this.course.id
    };
    var api = '/course-member';
    this.httpService.get(api, param).then(async (response: any) => {
      console.log(response);
      this.memberNum = response.data.data.total;
      if(response.data.data.total!=0){
        for(let i=0; i<this.memberNum; i++){
          this.memberList.push({
            id: response.data.data.list[i].id,
            name: response.data.data.list[i].name,
            sno: response.data.data.list[i].sno,
            sex: response.data.data.list[i].sex,
            rank: -1,
            image: response.data.data.list[i].image,
            courseExp: response.data.data.list[i].courseExp
          })
        }
      }
      //显示顺序
      if (this.isTeacher == '1') {
        this.orderByNo();
      } else {
        this.orderByExp();
      }
    });
  }

  async orderByNo() {
    this.isNo = '1';
    this.memberList.sort(function(a,b){
      return a.sno-b.sno;//	学号升序
    });
    for(let i=0; i<this.memberNum; i++){
      this.memberList[i].rank = i+1;
    }
  }

  async orderByExp() {
    this.isNo = '0';
    this.memberList.sort(function(a,b){
      return b.courseExp-a.courseExp;//	经验值降序
    });
    for(let i=0; i<this.memberNum; i++){
      this.memberList[i].rank = i+1;
      if(this.memberList[i].id==localStorage.getItem('UserId')){
        this.stu_rank = this.memberList[i].rank;
        this.stu_exp = this.memberList[i].courseExp;
      }
    }
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------------一些跳转啊------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  gotoMemCheck(index: number){
    this.router.navigate(['/member-list/member-checkin'], {queryParams:{stuId: this.memberList[index].id} });
  }

  gotodetail(){
    this.router.navigate(['/course/course-detail'], {queryParams:{code: this.course.code} });
  }
}
