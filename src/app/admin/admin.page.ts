import { Component, OnInit, ViewChild } from '@angular/core';
import {DataService} from '../services/data.service';

import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  @ViewChild("username") username;

  @ViewChild("password") password;
  constructor(private service:DataService, public login:LoginService) { }

  ngOnInit() {
  }

  signIn(){
   this.service.validateLogin(this.username, this.password);
   //this.service.validateLogin(this.username, this.password);

   console.log(this.login.loginState);
  }
}
