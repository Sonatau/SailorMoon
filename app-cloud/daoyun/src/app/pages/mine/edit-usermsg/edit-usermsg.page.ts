import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PickerController } from '@ionic/angular';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-edit-usermsg',
  templateUrl: './edit-usermsg.page.html',
  styleUrls: ['./edit-usermsg.page.scss'],
})
export class EditUsermsgPage implements OnInit {

  public user = {
    image: "image_null",
    email: "",
    exp: 0,
    id: -1,
    loginType: -1,
    name: "",
    school: "",
    schoolId: "",
    sex: 1,   //0-男，1-女
    sno: "",
    telephone: ""
  };
  public schoolShow = "请选择";

  schoolList = {
    total: 0,
    schools: []
  }

  constructor(public httpService: HttpService,
    public pickerController: PickerController,
    ) { }

  ngOnInit() {
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------------页面信息展示----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  ionViewWillEnter(){
    this.initUserInfo();
  }

  initUserInfo(){
    //getUserInfo
    var api = '/userinfo';//后台接口
    var params = { };
    this.httpService.get(api, params).then(async (response: any) => {
      console.log(response);
      this.user.image = response.data.data.user.image;
      if(response.data.data.user.name != "name_null"){
        this.user.name = response.data.data.user.name;
      }
      if(response.data.data.user.sno != "-1"){
        this.user.sno = response.data.data.user.sno;
      }
      this.user.sex = response.data.data.user.sex;
      if(response.data.data.user.school != null){
        this.schoolShow = response.data.data.user.school;
        this.user.school = response.data.data.user.school;
        this.user.schoolId = response.data.data.user.schoolId;
      }
      //getSchoolList
      this.getSchoolList();
    })
  }

  getSchoolList(){
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
    })
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  //-----------------------------------------------------请求学校列表-----------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------------------------//
  async openPicker(type) {
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
              this.schoolShow = selected[0].options[value.daoyun108.value].text;
              this.user.school = selected[0].options[value.daoyun108.value].text;
              this.user.schoolId = selected[0].options[value.daoyun108.value].id;
            } 
          }
        }]
    });
    await picker.present();
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
    }
    let columns = [];
    columns.push({
        name: `daoyun108`,
        options: options
    });
    return columns;
  }


async onSubmit(form: NgForm) {
  if (form.valid) {
    // if(this.schoolChoosed.id==-1 || this.academyChoosed.id==-1 || this.majorChoosed.id==-1){
    //   let toast = await this.toastController.create({
    //     message: '请选择学校、学院、专业！',
    //     duration: 2000
    //   });
    //   toast.present();
    // } else {
      var param = {
        image: this.user.image,
        name: this.user.name,
        schoolId: this.user.schoolId,
        school: this.user.school, 
      };
      console.log(param);
      var api = '/course';
      this.httpService.post_data(api, param).then(async (response: any) => {
        console.log(response);
        // this.course_code = response.data.data.code;
        // console.log(this.course_name);
        // const alert = await this.alertController.create({
        //   message: '班课创建成功！',
        //   buttons: [
        //     {
        //       text: '确认',
        //       cssClass: 'secondary',
        //       handler: (blah) => {
        //         this.router.navigate(['/course/create-success'], {queryParams:{code: this.course_code, name: this.course_name }});
        //       }
        //     }
        //   ]
        });
        // await alert.present();
      // });
    }
  }
}