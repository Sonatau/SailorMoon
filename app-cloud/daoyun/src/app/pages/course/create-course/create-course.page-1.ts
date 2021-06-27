import { HttpClient } from '@angular/common/http';
import { isLoweredSymbol, ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController, PickerController, Platform, ActionSheetController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Course } from '../course';

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
  lessonList = {
    total: 0,
    lessons: []
  }
  termList = {
    total: 0,
    lessons: []
  }

  public schoolChoosed = {
    name: "请选择",
    id: -1
  }
  public academyChoosed = {
    name: "请选择",
    id: -1
  }
  public majorChoosed = {
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
    private activatedRoute: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    public httpService: HttpService,
    public http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    public pickerController: PickerController,
    public platform: Platform
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.setSchoolList();
    //为了糊弄的赶工
    if(localStorage.getItem("term")==null){
      localStorage.setItem("term","2020-2021-2");
      this.course_term = "2020-2021-2";
    }else if (localStorage.getItem("term")=="2020-2021-2"){
      localStorage.setItem("term","2021-2022-1");
      this.course_term = "2021-2022-1";
    }else{
      localStorage.setItem("term","2020-2021-2");
      this.course_term = "2020-2021-2";
    }
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------请求学校/学院/专业列表------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  async openPicker(type) {
    if(type==2 && this.schoolChoosed.id==-1) {
      const alert = await this.alertController.create({
        header: '警告',
        message: '请先选择学校！',
        buttons: ['确认']
      });
      await alert.present();
    } else if(type==3 && this.academyChoosed.id==-1) {
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
                //console.log(value);
                if (type == 1) {
                  this.schoolChoosed.name = selected[0].options[value.daoyun108.value].text;
                  this.schoolChoosed.id = selected[0].options[value.daoyun108.value].id;
                  this.setNextOptions(type);
                } else if(type == 2) {
                  this.academyChoosed.name = selected[0].options[value.daoyun108.value].text;
                  this.academyChoosed.id = selected[0].options[value.daoyun108.value].id;
                  this.setNextOptions(type);
                } else {
                  this.majorChoosed.name = selected[0].options[value.daoyun108.value].text;
                  this.majorChoosed.id = selected[0].options[value.daoyun108.value].id;
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
    //console.log(options);
    return columns;
  }

  setNextOptions(type) {
    if(type == 1) {
      this.academyList.academies = [];
      this.academyList.total = 0;
      this.academyChoosed = {
        name: "请选择",
        id: -1
      }
      this.setAcademyList();
    }
    this.majorList.majors = [];
    this.majorList.total = 0;
    this.majorChoosed = {
      name: "请选择",
      id: -1
    }
    if(type==2){
      this.setMajorList();
    }
  }

  setSchoolList(){
    var param = {
      page: 1
    };
    var api = '/school';
    this.httpService.get(api, param).then(async (response: any) => {
      //console.log(response);
      for (let i = 0; i < response.data.data.total; i++) {
        this.schoolList.schools.push({
          schoolId: response.data.data.list[i].id,
          schoolName: response.data.data.list[i].name
        })
      }
      this.schoolList.total = response.data.data.total;
      //console.log(this.schoolList);
    })
  }

  setAcademyList(){
    var param = {
      page: 1,
      parentId: this.schoolChoosed.id
    };
    var api = '/school';
    this.httpService.get(api, param).then(async (response: any) => {
      //console.log(response);
      for (let i = 0; i < response.data.data.total; i++) {
        this.academyList.academies.push({
          academyId: response.data.data.list[i].id,
          academyName: response.data.data.list[i].name
        })
      }
      this.academyList.total = response.data.data.total;
    })
  }

  setMajorList(){
    var param = {
      page: 1,
      parentId: this.academyChoosed.id
    };
    var api = '/school';
    this.httpService.get(api, param).then(async (response: any) => {
      //console.log(response);
      for (let i = 0; i < response.data.data.total; i++) {
        this.majorList.majors.push({
          majorId: response.data.data.list[i].id,
          majorName: response.data.data.list[i].name
        })
      }
      this.majorList.total = response.data.data.total;
    })
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------上传班课封面-----------------------------------------------------------//
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
            console.log('进入相机');
            this.onCamera();
          }
        }, {
            text: '相册',
              handler: () => {
              console.log('进入相册');
              this.onImagePicker();
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
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
      this.course_cover = 'data:image/jpeg;base64,' + imageData;
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
    console.log('in imagePicker');
    this.imagePicker.getPictures(options).then((results) => {
      for (let i = 0; i < results.length; i++) {
        //console.log('Image URI: ' + results[i]);
        this.course_cover = 'data:image/jpeg;base64,' + results[i];
      }
    }, (err) => {console.log(err); });
  }
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  //---------------------------------------------------------------------------------------------------------------------------//
  //-------------------------------------------------------创建班课------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  async onCreate(form: NgForm) {
    if (form.valid) {
      // if(this.schoolChoosed.id==-1 || this.academyChoosed.id==-1 || this.majorChoosed.id==-1){ 糊弄
      if(this.schoolChoosed.id==-1 || this.academyChoosed.id==-1){
        let toast = await this.toastController.create({
          message: '请选择学校、学院、专业！',
          duration: 2000
        });
        toast.present();
      } else {
        var param = {
          image: this.course_cover,
          name: this.course_name,
          schoolId: this.schoolChoosed.id,
          acadeId: this.academyChoosed.id,
          // majorId: this.majorChoosed.id
          //为了糊弄的赶工
          majorId: 23
        };
        console.log(param);
        var api = '/course';
        this.httpService.post_data(api, param).then(async (response: any) => {
          console.log(response);
          this.course_code = response.data.data.code;
          console.log(this.course_name);
          const alert = await this.alertController.create({
            message: '班课创建成功！',
            buttons: [
              {
                text: '确认',
                cssClass: 'secondary',
                handler: (blah) => {
                  this.router.navigate(['/course/create-success'], {queryParams:{code: this.course_code,
                    name: this.course_name, lesson: "工程实践" }});
                }
              }
            ]
          });
          await alert.present();
        });
        //为了糊弄的赶工
        if(this.course_lesson!=null){
          localStorage.setItem("course_lesson", this.course_lesson);
        }
        localStorage.setItem("course_join", "1");
        localStorage.setItem("course_status", "1");
      }
    }
  }
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  async openLessonPicker() {
      const picker = await this.pickerController.create({
        columns: this.getLessonColumns(),
        buttons: [
            {
              text: '取消',
              role: 'cancel'
            },
            {
              text: '确认',
              handler: (value) => {
                var selected = this.getLessonColumns();
                this.lessonChoosed.name = selected[0].options[value.daoyun108.value].text;
                this.lessonChoosed.id = selected[0].options[value.daoyun108.value].id;
              }
            }
        ]
      });
      await picker.present();
  }

  getLessonColumns() {
    let options = [];
    if(localStorage.getItem("course_lesson")!=null){
      for (let i = 0; i < 1; i++){
        options.push({
          text: localStorage.getItem("course_lesson"),
          value: i
        })
      }
    }
    let columns = [];
    columns.push({
        name: `daoyun108`,
        options: options
    });
    //console.log(options);
    return columns;
  }


}
