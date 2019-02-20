import { Component } from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx'; 
import { HttpClient} from '@angular/common/http';
import { RequestOptions, RequestMethod } from '@angular/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
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
   // this.load();
   this.sendData(pos.coords.longitude, pos.coords.latitude);

    },(err : PositionError)=>{
        console.log("error : " + err.message);
    });
  }

  load(){

    this.http.get('http://localhost/dbconnect.php').subscribe((data : any) =>
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

  sendData(longitude, latitude){
      this.http.post('http://localhost/getData.php').subscribe
  }

/*   sendPostRequest() {
    var head = new Headers();
    head.append("Accept", 'application/json');
    head.append('Content-Type', 'application/json' );
    const requestOptions = new RequestOptions({ method: RequestMethod.Post, headers: head });

    let postData = {
            "longitude": "12345",
            "latitude": "67890"
    }

    this.http.post("http://127.0.0.1:3000/roadDisturbanceLocator", postData, requestOptions)
      .subscribe(data => {
        console.log(data['_body']);
       }, error => {
        console.log(error);
      });
  } */
}
