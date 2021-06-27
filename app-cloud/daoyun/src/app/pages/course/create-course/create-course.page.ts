import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController, Platform,  PickerController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';
import { PickerService } from 'src/app/shared/services/picker.service';
import { PictureService } from 'src/app/shared/services/picture.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.page.html',
  styleUrls: ['./create-course.page.scss'],
})
export class CreateCoursePage implements OnInit {

  public course_cover = "image_null";
  public course_name;
  public course_lesson;
  public course_code;

  schoolList = {
    total: 0,
    options: []
  }
  academyList = {
    total: 0,
    options: []
  }
  lessonList = {
    total: 0,
    options: []
  }
  termList = {
    total: 0,
    options: []
  }

  public termId;

  public schoolChoosed = {
    name: "请选择",
    id: -1
  }
  public academyChoosed = {
    name: "请选择",
    id: -1
  }
  public lessonChoosed = {
    name: "请选择",
    id: -1
  }
  public termChoosed = {
    name: "请选择",
    id: -1
  }

  constructor(
    private router: Router,
    public httpService: HttpService,
    public pickerService: PickerService,
    public pictureService: PictureService,
    public http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    private pickerController: PickerController,
    public platform: Platform
  ) { }

  ngOnInit() { }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------各种列表初始化---------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  ionViewWillEnter() {
    this.initList();
    this.course_name = null;
    this.course_lesson = null;
  }

  initList(){
    this.setTermList();
    this.setSchoolList();
    this.setLessonList();
  }

  setSchoolList(){
    this.schoolList.options = [];
    this.schoolList.total = 0;
    this.schoolChoosed = {
      name: "请选择",
      id: -1
    }
    var param = {
      page: 1
    };
    var api = '/school';
    this.httpService.get(api, param).then(async (response: any) => {
      //console.log(response);
      for (let i = 0; i < response.data.data.total; i++) {
        this.schoolList.options.push({
          id: response.data.data.list[i].id,
          name: response.data.data.list[i].name
        })
      }
      this.schoolList.total = response.data.data.total;
      //console.log(this.schoolList);
    })
  }
  setAcademyList(){
    this.academyList.options = [];
    this.academyList.total = 0;
    this.academyChoosed = {
      name: "请选择",
      id: -1
    }
    var param = {
      page: 1,
      parentId: this.schoolChoosed.id
    };
    var api = '/school';
    this.httpService.get(api, param).then(async (response: any) => {
      //console.log(response);
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
      this.termId = response.data.data.list[0].id;
      //根据id取学期的列表，并更新默认值
      var param_term = {
        page: 1,
        id: this.termId
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
    this.lessonChoosed = {
      name: "请选择",
      id: -1
    }
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
    if(type==1 && this.schoolChoosed.id==-1) {
      const alert = await this.alertController.create({
        header: '警告',
        message: '请先选择学校！',
        buttons: ['确认']
      });
      await alert.present();
    } else {
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
        this.lessonChoosed = await this.pickerService.createPicker(this.lessonList);
      }
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
  //-----------------------------------------------------选择班课封面-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  addPicture(){
    var img = this.pictureService.getPicture();
    if(img!=null){
      this.course_cover = img;
    }
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-------------------------------------------------------创建班课------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  async onCreate(form: NgForm) {
    if (form.valid) {
      if(this.schoolChoosed.id==-1 || this.academyChoosed.id==-1){
        let toast = await this.toastController.create({
          message: '请选择学校和学院！',
          duration: 2000
        });
        toast.present();
      } else if(this.lessonChoosed.id==-1 && this.course_lesson==null){
        let toast = await this.toastController.create({
          message: '请选择课程或自定义课程！',
          duration: 2000
        });
        toast.present();
      } else {
        if(this.course_lesson!=null && this.course_lesson!=""){
          //如果自定义课程
          var param_add = {
            name: this.course_lesson
          };
          var api = '/lesson';
          this.httpService.post_data(api, param_add).then(async (response: any) => {
            console.log(response);
            this.lessonChoosed.id = response.data.data.id;
            this.lessonChoosed.name = this.course_lesson;
            this.createCourse();
          });
        } else {
          this.createCourse();
        }
      }
    }
  }

  createCourse(){
    var param_creat = {
      image: this.course_cover,
      name: this.lessonChoosed.name+'-'+this.course_name,
      schoolId: this.schoolChoosed.id,
      acadeId: this.academyChoosed.id,
      termId: this.termChoosed.id,
      lessonId: this.lessonChoosed.id,
      state: 1,
      okJoin: 1
    };
    var api = '/course';
    this.httpService.post_data(api, param_creat).then(async (response: any) => {
      console.log(response);
      this.course_code = response.data.data.code;
      const alert = await this.alertController.create({
        message: '班课创建成功！',
        buttons: [
          {
            text: '确认',
            cssClass: 'secondary',
            handler: (blah) => {
              localStorage.setItem('courseCode', this.course_code);
              localStorage.setItem('courseName', this.lessonChoosed.name+'-'+this.course_name);
              this.router.navigate(['/course/create-success']);
            }
          }
        ]
      });
      await alert.present();
    });
  }

}
