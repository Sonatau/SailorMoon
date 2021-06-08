import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-success',
  templateUrl: './create-success.page.html',
  styleUrls: ['./create-success.page.scss'],
})
export class CreateSuccessPage implements OnInit {

  public code: string;
  constructor(public activeRoute: ActivatedRoute,
    public router: Router) {
    this.code = this.activeRoute.snapshot.queryParams['code']
  }

  ngOnInit() {
  }

  gotoDetail(){
    this.router.navigate(['/course/course-detail'], {queryParams:{code: this.code} });
  }

}
