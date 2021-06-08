import { HttpClient } from '@angular/common/http';
import { isLoweredSymbol } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController, PickerController, Platform, ActionSheetController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';
// import { Course } from '../course';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.page.html',
  styleUrls: ['./create-course.page.scss'],
})
export class CreateCoursePage implements OnInit {

  // public course: Course;
  public course_name;
  public covers = [];
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
  public flag = 0;
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

  //----------------------------------------------------------不知道有用无用可能要被删掉的-------------------------------------------//
  selectedSchool: any;
  selectedAcademy: string;
  // courseList: any;
  // course = [[]];
  tempCourse: any;
  term = [[]];
  termOptions = 12;
  courseOptions: number;
  mark: any;
  temp: any;
  //-------------------------------------------------------------------------------------------------------------------------------//

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
  ) { 
    // this.course = this.initCourse();
  }

  ngOnInit() { }

  ionViewWillEnter() {
    //this.course = this.initCourse();
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

  // /**
  //  * 初始化课程
  //  * @returns {Course}
  //  */
  //  initCourse(): Course {
  //   return {
  //     covers: [],
  //     code: '',
  //     name: '',
  //     school: '',
  //     academy: '',
  //     major: '',
  //     schoolId: null,
  //     academyId: null,
  //     majorId: null,
  //     teacher: ''
  //   };
  // }

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
                  this.setNextOptions(type, this.schoolChoosed.id);
                } else if(type == 2) {
                  this.academyChoosed.name = selected[0].options[value.daoyun108.value].text;
                  this.academyChoosed.id = selected[0].options[value.daoyun108.value].id;
                  this.setNextOptions(type, this.academyChoosed.id);
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

  setNextOptions(type, parentid) {
    if(type == 1) {
      this.academyList.academies = [];
      this.academyList.total = 0;
      this.academyChoosed = {
        name: "请选择",
        id: -1
      }
    }
    this.majorList.majors = [];
    this.majorList.total = 0;
    this.majorChoosed = {
      name: "请选择",
      id: -1
    }
    var param = {
      page: 1,
      parentId: parentid
    };
    var api = '/school';
    this.httpService.get(api, param).then(async (response: any) => {
      console.log(response);
      for (let i = 0; i < response.data.data.total; i++) {
        if(type == 1){
          this.academyList.academies.push({
            academyId: response.data.data.list[i].id,
            academyName: response.data.data.list[i].name
          })
          this.academyList.total = response.data.data.total;
        } else {
          this.majorList.majors.push({
            majorId: response.data.data.list[i].id,
            majorName: response.data.data.list[i].name
          })
          this.majorList.total = response.data.data.total;
        }
      }
      // console.log(this.academyList);
      // console.log(this.majorList);
    })
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
    this.covers = [];
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
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.covers.push(base64Image);
    }, (err) => {
      // Handle error
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
        console.log('Image URI: ' + results[i]);
        let base64Image = 'data:image/jpeg;base64,' + results[i];
        this.covers.push(base64Image);
      }
    }, (err) => {console.log(err); });
  }
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//

  //---------------------------------------------------------------------------------------------------------------------------//
  //-------------------------------------------------------创建课程------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  async onCreate(form: NgForm) {
    if (form.valid) {
      if(this.schoolChoosed.id==-1 || this.academyChoosed.id==-1 || this.majorChoosed.id==-1){
        let toast = await this.toastController.create({
          message: '请选择学校、学院、专业！',
          duration: 2000
        });
        toast.present();
      } else {
        let image = this.covers[0];
        if(image == null) image = "image_null";
        var param = {
          image: image,
          name: this.course_name,
          schoolId: this.schoolChoosed.id,
          acadeId: this.academyChoosed.id,
          majorId: this.majorChoosed.id
        };
        console.log(param);
        var api = '/course';
        this.httpService.post(api, param).then(async (response: any) => {
          console.log(response);
          this.course_code = response.data.data.code;
          console.log(this.course_name);
          const alert = await this.alertController.create({
            message: '课程创建成功！',
            buttons: [
              {
                text: '确认',
                cssClass: 'secondary',
                handler: (blah) => {
                  this.router.navigate(['/course/create-success'], {queryParams:{code: this.course_code} });
                }
              }
            ]
          });
          await alert.present();
        });
      }
    }
  }
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//


}
