import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(public http: HttpClient, public navCtrl: NavController) { }

  public commonUrl = 'http://47.93.231.158:8080';
  //public commonUrl = 'http://localhost:8100/';
  public headers:any;
  
  //获取数据
  get(api, params) {
    return new Promise((resolve, reject) => {
      this.setToken(); 
      axios.get(this.commonUrl + api, {
        params: params,
        withCredentials: false
      }).then(function (response) {
        resolve(response);
      }).catch(function (error) {
        reject(error);
      })
    })
  }
  
  get_withoutParams(api) {
    return new Promise((resolve, reject) => {
      this.setToken(); 
      axios.get(this.commonUrl + api, {
        withCredentials: false
      }).then(function (response) {
        resolve(response);
      }).catch(function (error) {
        reject(error);
      })
    })
  }

  get_withoutToken(api, params) {
    return new Promise((resolve, reject) => {
      axios.get(this.commonUrl + api, {
        params: params,
        withCredentials: false
      }).then(function (response) {
        resolve(response);
      }).catch(function (error) {
        reject(error);
      })
    })

  }

  //新增数据
  post_params(api, params) {
    return new Promise((resolve, reject) => {
      this.setToken();
        axios({
          method: 'post',
          url: this.commonUrl + api,
          params: params,
          data: params,
          withCredentials: false
        }).then(function (response) {
          resolve(response);
        })
          .catch(function (error) {
            reject(error);
          }); 
    })
  }

  post_data(api, params) {
    return new Promise((resolve, reject) => {
      this.setToken();
        axios({
          method: 'post',
          url: this.commonUrl + api,
          data: params,
          withCredentials: false
        }).then(function (response) {
          resolve(response);
        })
          .catch(function (error) {
            reject(error);
          }); 
    })
  }

  post_withoutToken(api, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: this.commonUrl + api,
        data: params,
        withCredentials: false
      }).then(function (response) {
        resolve(response);
      })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    })
  }

  post_byURL(api, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: api,
        data: params,
        withCredentials: false
      }).then(function (response) {
        // console.log(response);
        resolve(response);
      })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    })
  }

  //修改数据并更新
  put(api, params) {
    this.setToken();
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url: this.commonUrl + api,
        data: params,
        withCredentials: false
      }).then(function (response) {
        // console.log(response);
        resolve(response);
      })
        .catch(function (error) {
          reject(error);
        });
    })
  }

  //修改数据并（局部）更新
  patch(api, params) {
    return new Promise((resolve, reject) => {
      this.setToken();
      axios({
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'patch',
        url: this.commonUrl + api,
        data: params,
        withCredentials: false
      }).then(function (response) {
        resolve(response);
      })
        .catch(function (error) {
          reject(error);
        });
    })
  }

  //删除数据
  delete(api, params) {
    return new Promise((resolve, reject) => {
      this.setToken();
      axios.delete(this.commonUrl + api, {
        params: params,
        withCredentials: false
      }).then(function (response) {
        resolve(response);
      })
        .catch(function (error) {
          reject(error);
        })
    })
  }

  //设置同步
  runAfter(function1,function2){
    axios.all([function1])
    .then(axios.spread(function2))
  }

  setToken(){
    //拦截器 头部设置token
    axios.interceptors.request.use((config) => {
     if (localStorage.getItem("token")) {
       config.headers['token']=localStorage.getItem("token");
     }
     return config;
   },(error) =>{
     console.log('错误参数')
     return Promise.reject(error);
   });
 }
 
}
