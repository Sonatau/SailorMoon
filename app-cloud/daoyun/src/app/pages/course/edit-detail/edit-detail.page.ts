import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ToastController, PickerController, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { HttpService } from 'src/app/shared/services/http.service';
import { Course } from '../course';
import { EventService } from 'src/app/shared/services/event.service';

@Component({
  selector: 'app-edit-detail',
  templateUrl: './edit-detail.page.html',
  styleUrls: ['./edit-detail.page.scss'],
})
export class EditDetailPage implements OnInit {

  public course: Course;

  schoolList = {
    total: 0,
    schools: []
  }
  academyList = {
    total: 0,
    academies: []
  }
  majorList = {
    total: 0,
    majors: []
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    public httpService: HttpService,
    public http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    public pickerController: PickerController,
    public platform: Platform) { 
  }

  ngOnInit() {  //初始化页面的时候调一次
    this.course = this.initCourse();
    // console.log('edit_detail-ngOnInit');
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------初始：请求学校+课程信息------------------------------------------------------//
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
      schools: []
    }
    this.academyList = {
      total: 0,
      academies: []
    }
    this.majorList = {
      total: 0,
      majors: []
    }
  }

  setOptions(){
    var param = {
      page: 1
    };
    var api = '/school';
    this.httpService.get(api, param).then(async (response: any) => {
      for (let i = 0; i < response.data.data.total; i++) {
        this.schoolList.schools.push({
          schoolId: response.data.data.list[i].id,
          schoolName: response.data.data.list[i].name
        })
      }
      this.schoolList.total = response.data.data.total;
      this.setAcademyList();
    })
  }

  setAcademyList(){
    var param = {
      page: 1,
      parentId: this.course.schoolId
    };
    var api = '/school';
    this.httpService.get(api, param).then(async (response: any) => {
      for (let i = 0; i < response.data.data.total; i++) {
        this.academyList.academies.push({
          academyId: response.data.data.list[i].id,
          academyName: response.data.data.list[i].name
        })
      }
      this.academyList.total = response.data.data.total;
      this.setMajorList();
    })
  }

  setMajorList(){
    var param = {
      page: 1,
      parentId: this.course.academyId
    };
    var api = '/school';
    this.httpService.get(api, param).then(async (response: any) => {
      for (let i = 0; i < response.data.data.total; i++) {
        this.majorList.majors.push({
          majorId: response.data.data.list[i].id,
          majorName: response.data.data.list[i].name
        })
      }
      this.majorList.total = response.data.data.total;
    })
  }

  /**
   * 初始化课程信息
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
      major: "",
      teacher: "",
      schoolId: -1,
      academyId: -1,
      majorId: -1,
      teacherId: -1
    };
  }

  setCourse() {
    this.course.code = this.activatedRoute.snapshot.queryParams['code'];
    var param = {
      name: this.course.code,
      page: 1
    };
    var api = '/course';
    this.httpService.get(api, param).then(async (response: any) => {
      this.course.id = response.data.data.list[0].id;
      this.course.name = response.data.data.list[0].name;
      this.course.school = response.data.data.list[0].school;
      this.course.academy = response.data.data.list[0].academy;
      this.course.major = response.data.data.list[0].major;
      this.course.teacher = response.data.data.list[0].teacher;
      this.course.cover = response.data.data.list[0].image;
      this.course.schoolId = response.data.data.list[0].schoolId;
      this.course.academyId = response.data.data.list[0].acadeId;
      this.course.majorId = response.data.data.list[0].majorId;
      this.course.teacherId = response.data.data.list[0].teacherId;
    });
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  //---------------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------请求学校/学院/专业列表------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  async openPicker(type) {
    if(type==3 && this.course.academyId==-1) {
      const alert = await this.alertController.create({
        header: '警告',
        message: '请先选择院系！',
        buttons: ['确认']
      });
      await alert.present();
    } else {
      const picker = await this.pickerController.create({
        columns: this.getColumns(type),
        buttons: [
          {
            text: '取消',
            role: 'cancel'
          },
          {
            text: '确认',
            handler: (value) => {
              var selected = this.getColumns(type);
              if (type == 1) {
                this.course.school = selected[0].options[value.daoyun108.value].text;
                this.course.schoolId = selected[0].options[value.daoyun108.value].id;
                this.setNextOptions(type);
              } else if(type == 2) {
                this.course.academy = selected[0].options[value.daoyun108.value].text;
                this.course.academyId = selected[0].options[value.daoyun108.value].id;
                this.setNextOptions(type);
              } else {
                this.course.major = selected[0].options[value.daoyun108.value].text;
                this.course.majorId = selected[0].options[value.daoyun108.value].id;
              }
            }
          }
        ]
      });
      await picker.present();
    }
  }

  getColumns(type) {
    let options = [];
    if(type == 1) {
      for (let i = 0; i < this.schoolList.total; i++){
        options.push({
          text: this.schoolList.schools[i].schoolName,
          id: this.schoolList.schools[i].schoolId,
          value: i
        })
      }
    } else if(type == 2) {
      for (let i = 0; i < this.academyList.total; i++){
        options.push({
          text: this.academyList.academies[i].academyName,
          id: this.academyList.academies[i].academyId,
          value: i
        })
      }
    } else {
      for (let i = 0; i < this.majorList.total; i++){
        options.push({
          text: this.majorList.majors[i].majorName,
          id: this.majorList.majors[i].majorId,
          value: i
        })
      }
    }
    let columns = [];
    columns.push({
        name: `daoyun108`,
        options: options
    });
    return columns;
  }

  setNextOptions(type) {
    if(type == 1) {
      this.academyList.academies = [];
      this.academyList.total = 0;
      this.course.academy = "请选择";
      this.course.academyId = -1;
      this.setAcademyList();
    }
    this.majorList.majors = [];
    this.majorList.total = 0;
    this.course.major = "请选择";
    this.course.majorId = -1;
    if(type==2){
      this.setMajorList();
    }
  }
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------上传课程封面-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  /**
   * 上传图片
   * @returns {Promise<void>}
   */
  async onPresentActiveSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: '选择您的操作',
      buttons: [
        {
          text: '拍照',
          role: 'destructive',
          handler: () => {
            this.onCamera();
          }
        }, {
            text: '相册',
              handler: () => {
              this.onImagePicker();
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    await actionSheet.present();
  }

  /**
   * 拍照
   */
   onCamera() {
    const options: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      this.course.cover = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }

  /**
   * 相册
   */
  onImagePicker() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      quality: 10,
      outputType: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (let i = 0; i < results.length; i++) {
        this.course.cover = 'data:image/jpeg;base64,' + results[i];
      }
    }, (err) => {console.log(err); });
  }
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  //---------------------------------------------------------------------------------------------------------------------------//
  //-------------------------------------------------------提交&跳转------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  async onSubmit(form: NgForm) {
    if (form.valid) {
      if(this.course.academyId==-1 || this.course.majorId==-1){
        let toast = await this.toastController.create({
          message: '请选择学院、专业！',
          duration: 2000
        });
        toast.present();
      } else {
        var param = {
          id: this.course.id,
          image: this.course.cover,
          name: this.course.name,
          schoolId: this.course.schoolId,
          acadeId: this.course.academyId,
          majorId: this.course.majorId,
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
                  this.router.navigate(['/course/course-detail'], {queryParams:{code: this.course.code} });
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
    this.router.navigate(['/course/course-detail'], {queryParams:{code: this.course.code} });
  }
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//


}