import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-success',
  templateUrl: './create-success.page.html',
  styleUrls: ['./create-success.page.scss'],
})
export class CreateSuccessPage implements OnInit {

  public code: string;
  public name: string;
  public lesson: string;
  constructor(public activeRoute: ActivatedRoute,
    public router: Router) {
    this.ionViewWillEnter();
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.code = this.activeRoute.snapshot.queryParams['code'];
    this.name = this.activeRoute.snapshot.queryParams['name'];
    this.lesson = this.activeRoute.snapshot.queryParams['lesson'];
  }

  gotoDetail(){
    this.router.navigate(['/course/course-detail'], {queryParams:{code: this.code} });
  }

}
