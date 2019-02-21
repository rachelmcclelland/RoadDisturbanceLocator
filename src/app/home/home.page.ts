import { Component } from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx'; 
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { RequestOptions, RequestMethod } from '@angular/http';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  options : GeolocationOptions;
  currentPos : Geoposition;

  constructor(public geolocation: Geolocation, public http: HttpClient, private service:DataService) {

  }

  ionViewDidEnter(){
    this.getUserPosition();
  }

  getUserPosition(){
    this.options = {
        enableHighAccuracy : true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

        this.currentPos = pos;      
        console.log(pos);
    //    console.log(pos.coords.latitude, pos.coords.longitude);
        this.service.sendData(pos.coords.latitude, pos.coords.longitude);

        this.service.getData();

    },(err : PositionError)=>{
        console.log("error : " + err.message);
    });
  }
}
