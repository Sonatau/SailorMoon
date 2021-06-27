import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController, PickerController, Platform } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';
import { Course } from '../course';
import { PickerService } from 'src/app/shared/services/picker.service';
import { PictureService } from 'src/app/shared/services/picture.service';

@Component({
  selector: 'app-edit-detail',
  templateUrl: './edit-detail.page.html',
  styleUrls: ['./edit-detail.page.scss'],
})
export class EditDetailPage implements OnInit {

  public course: Course;

  schoolList = {
    total: 0,
    options: []
  }
  academyList = {
    total: 0,
    options: []
  }
  termList = {
    total: 0,
    options: []
  }
  lessonList = {
    total: 0,
    options: []
  }

  public schoolChoosed = {
    name: "请选择",
    id: -1
  }
  public academyChoosed = {
    name: "请选择",
    id: -1
  }
  public termChoosed = {
    name: "请选择",
    id: -1
  }
  public lessonChoosed = {
    name: "请选择",
    id: -1
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public httpService: HttpService,
    public http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    public pickerController: PickerController,
    public platform: Platform,
    public pickerService: PickerService,
    public pictureService: PictureService) { 
  }

  ngOnInit() {  //初始化页面的时候调一次
    this.course = this.initCourse();
    // console.log('edit_detail-ngOnInit');
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------初始：请求学校+班课信息------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  ionViewWillEnter() {  //每次进来都会调
    this.initOption();
    this.setCourse();
    this.setOptions();
    // console.log('edit-detail-ionViewWillEnter');
  }

  initOption(){
    this.schoolList = {
      total: 0,
      options: []
    }
    this.academyList = {
      total: 0,
      options: []
    }
    this.termList = {
      total: 0,
      options: []
    }
    this.lessonList = {
      total: 0,
      options: []
    }
  }

  /**
   * 初始化班课信息
   * @returns {Course}
   */
   initCourse(): Course {
    return {
      id: -1,
      cover: "",
      code: "",
      name: "",
      school: "",
      academy: "",
      teacher: "",
      schoolId: -1,
      academyId: -1,
      teacherId: -1,
      term: "",
      termId: -1,
      join: true,
      status: true,
      lesson: "",
      lessonId: -1,
    };
  }

  setCourse() {
    this.course.code = localStorage.getItem('courseCode');
    var param = {
      name: this.course.code,
      page: 1,
      isSelf: true
    };
    var api = '/course';
    this.httpService.get(api, param).then(async (response: any) => {
      // console.log(response);
      this.course.id = response.data.data.list[0].id;
      this.course.name = response.data.data.list[0].name;
      this.course.teacher = response.data.data.list[0].teacher;
      this.course.cover = response.data.data.list[0].image;

      this.lessonChoosed.name = response.data.data.list[0].lesson;
      this.schoolChoosed.name = response.data.data.list[0].school;
      this.academyChoosed.name = response.data.data.list[0].academy;
      this.termChoosed.name = response.data.data.list[0].term;
      this.lessonChoosed.id = response.data.data.list[0].lessonId;
      this.schoolChoosed.id = response.data.data.list[0].schoolId;
      this.academyChoosed.id = response.data.data.list[0].acadeId;
      this.termChoosed.id = response.data.data.list[0].termId;

      this.setOptions();
    });
  }

  setOptions(){
    var param = {
      page: 1
    };
    var api = '/school';
    this.httpService.get(api, param).then(async (response: any) => {
      for (let i = 0; i < response.data.data.total; i++) {
        this.schoolList.options.push({
          id: response.data.data.list[i].id,
          name: response.data.data.list[i].name
        })
      }
      this.schoolList.total = response.data.data.total;
    })
    this.setAcademyList();
    this.setTermList();
    this.setLessonList();
  }

  setAcademyList(){
    this.academyList = {
      total: 0,
      options: []
    }
    var param = {
      page: 1,
      parentId: this.schoolChoosed.id
    };
    var api = '/school';
    this.httpService.get(api, param).then(async (response: any) => {
      for (let i = 0; i < response.data.data.total; i++) {
        this.academyList.options.push({
          id: response.data.data.list[i].id,
          name: response.data.data.list[i].name
        })
      }
      this.academyList.total = response.data.data.total;
    })
  }

  setTermList(){
    //根据lable取对应的id
    var param_id = {
      page: 1,
      label: 'semester'
    };
    var api = '/dictionary';
    this.httpService.get(api, param_id).then(async (response: any) => {
      // console.log(response);
      this.course.termId = response.data.data.list[0].id;
      //根据id取学期的列表，并更新默认值
      var param_term = {
        page: 1,
        id: this.course.termId
      };
      var api = '/dictionary-detail';
      this.httpService.get(api, param_term).then(async (response: any) => {
        // console.log(response);
        for (let i = 0; i < response.data.data.total; i++) {
          this.termList.options.push({
            id: response.data.data.list[i].id,
            name: response.data.data.list[i].name
          })
          if(response.data.data.list[i].isDefault==1){
            this.termChoosed.name = response.data.data.list[i].name;
            this.termChoosed.id = response.data.data.list[i].id;
          }
        }
        this.termList.total = response.data.data.total;
      })
    })
  }

  setLessonList(){
    this.lessonList.options = [];
    this.lessonList.total = 0;
    var param = { };
    var api = '/lesson';
    this.httpService.get(api, param).then(async (response: any) => {
      // console.log(response);
      this.lessonList.options = response.data.data.list;
      this.lessonList.total = response.data.data.list.length;
      // console.log(this.lessonList);
    })
  }


  //---------------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------请求学校/学院/专业列表------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  async openPicker(type, listName) {  //1表示有绑定的上级菜单 0表示没有
    if(listName=='term'){
      this.termChoosed = await this.pickerService.createPicker(this.termList);
    }else if(listName=='school'){
      const picker = await this.pickerController.create({
        columns: this.getColumns(),
        buttons: [
            {
              text: '取消',
              role: 'cancel'
            },
            {
              text: '确认',
              handler: (value) => {
                var selected = this.getColumns();
                //console.log(value);
                this.schoolChoosed.name = selected[0].options[value.daoyun108.value].text;
                this.schoolChoosed.id = selected[0].options[value.daoyun108.value].id;
                this.setAcademyList();
              }
            }
        ]
      });
      await picker.present();
    }else if(listName=='academy'){
      // console.log(this.academyList);
      this.academyChoosed = await this.pickerService.createPicker(this.academyList);
    }else if(listName=='lesson'){
      // console.log(this.lessonList);
      this.lessonChoosed = await this.pickerService.createPicker(this.lessonList);
    }
  }

  getColumns() {
    let options = [];
    for (let i = 0; i < this.schoolList.total; i++){
      options.push({
        text: this.schoolList.options[i].name,
        id: this.schoolList.options[i].id,
        value: i
      })
    }
    let columns = [];
    columns.push({
      name: `daoyun108`,
      options: options
    });
    //console.log(options);
    return columns;
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------上传班课封面-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  addPicture(){
    var img = this.pictureService.getPicture();
    if(img!=null){
      this.course.cover = img;
    }
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-------------------------------------------------------提交&跳转------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  async onSubmit(form: NgForm) {
    if (form.valid) {
      if(this.academyChoosed.id==-1){
        let toast = await this.toastController.create({
          message: '请选择学院！',
          duration: 2000
        });
        toast.present();
      } else {
        var param = {
          id: this.course.id,
          image: this.course.cover,
          name: this.course.name,
          schoolId: this.schoolChoosed.id,
          acadeId: this.academyChoosed.id,
          termId: this.termChoosed.id,
          lessonId: this.lessonChoosed.id
        };
        var api = '/course';
        this.httpService.put(api, param).then(async (response: any) => {
          const alert = await this.alertController.create({
            message: '信息修改成功！',
            buttons: [
              {
                text: '确认',
                cssClass: 'secondary',
                handler: (blah) => {
                  this.gotodetail();
                }
              }
            ]
          });
          await alert.present();
        });
      }
    }
  }

  gotodetail(){
    this.router.navigate(['/course/course-detail'], {queryParams:{code: this.course.code}});
  }

}