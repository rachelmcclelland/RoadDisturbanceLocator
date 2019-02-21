import { Component, ViewChild } from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx'; 
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { RequestOptions, RequestMethod } from '@angular/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild("latitude") latitude;

  @ViewChild("longitude") longitude;
  public items : Array<any> = [];

  options : GeolocationOptions;
  currentPos : Geoposition;

  constructor(public geolocation: Geolocation, public http: HttpClient) {

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
    this.getData();
    this.sendData(pos.coords.latitude, pos.coords.longitude);

    },(err : PositionError)=>{
        console.log("error : " + err.message);
    });
  }

  getData(){
    
    this.http.get('http://localhost/getData.php').subscribe((data : any) =>
    {
       console.dir(data);
       this.items = data;
       
    },
    (error : any) =>
    {
       console.dir(error);
    });

    console.log(this.items);

  }

  private baseURI : string  = "http://localhost/";

  sendData(lat, long){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "create", "latitude" : lat, "longitude" : long },
        url       : any      	= this.baseURI + "sendData.php";

    this.http.post(url, JSON.stringify(options), headers)
    .subscribe((data : any) =>
    {
       // If the request was successful notify the user
//this.sendNotification(`Congratulations the technology: ${name} was successfully added`);
      console.log("lat and long was sent to the database");
    },
    (error : any) =>
    {
        console.log(error);
    });
 }
}
