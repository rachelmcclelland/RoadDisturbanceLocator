import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx'; 
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { RequestOptions, RequestMethod } from '@angular/http';
import {DataService} from '../services/data.service';
import { Variable } from '@angular/compiler/src/render3/r3_ast';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  options : GeolocationOptions;
  currentPos : Geoposition;
  public markers: any[] = [];

  @ViewChild('map') mapElement: ElementRef;
  map: any;


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

        this.loadMap(pos.coords.latitude, pos.coords.longitude);
    },(err : PositionError)=>{
        console.log("error : " + err.message);
    });
  }

  loadMap(lat, long){
 
      let latLng = new google.maps.LatLng(lat, long);

      let mapOptions = {
        center: latLng, //where we want the centre of the map to be
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP //road style map
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.addMarker(lat, long);

  }

  public addMarker(lat: number, lng: number): void {

    let latLng = new google.maps.LatLng(lat, lng);

    let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
    });

    //this.markers.push(marker);

}
}
