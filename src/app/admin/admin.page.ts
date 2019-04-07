import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {DataService} from '../services/data.service';
import { NavController } from '@ionic/angular'; 
import { AlertController } from '@ionic/angular';

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
    public navCtrl: NavController, private alertCtrl: AlertController) { 
  }

  ngOnInit() {
  }

  async signIn(){
    console.log(this.name);
    console.log(this.pass);

    if(this.name ==='' ){
      var alert = await this.alertCtrl.create({
        header:"ATTENTION",
        subHeader:"Username field is empty",

        buttons: ['OK']
      });

      await alert.present();
    }
    else if(this.pass === '')
    {
      var alert = await this.alertCtrl.create({
        header:"ATTENTION",
        subHeader: "Password field is empty",

        buttons: ['OK']
      });

      await alert.present();
    }
    else{
      this.service.validateLogin(this.name, this.pass);
    }

    console.log(this.login.loginState);

  }
}
