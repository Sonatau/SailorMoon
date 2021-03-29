import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
export const App = 'App';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomePage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  GoToLogin(){
    this.router.navigateByUrl('\login')
  }

}
