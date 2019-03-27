import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {DataService} from '../services/data.service';
import { NavController } from '@ionic/angular'; 

import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  name:string = "";
  pass:string = "";

  constructor(private service:DataService, public login:LoginService,
    public navCtrl: NavController) { 
  }

  ngOnInit() {
  }

  signIn(){
    console.log(this.name);
    console.log(this.pass);
    this.service.validateLogin(this.name, this.pass);

    console.log(this.login.loginState);

  }
}
