import { Injectable, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

    private baseURI : string  = "http://localhost/";

    constructor(private http: HttpClient) { }

    //return all the accident markers from the MySQL database
    getAccidentMarkers() : Observable<any>{
    
      return this.http.get('http://localhost/getAccidentData.php');
    }
    
    getPotholeMarkers() : Observable<any>{
    
      return this.http.get('http://localhost/getPotholeData.php');
    } 

    //method for sending the latitude and longitude of an accident marker placed
    //by a user, to the MySQL database through the .php file
    sendAccidentData(lat : number, long){
        let headers : any = new HttpHeaders({ 'Content-Type': 'application/json' }),
            options : any = { "key" : "create", "latitude" : lat, "longitude" : long },
            url : any = this.baseURI + "sendAccidentData.php";
    
        this.http.post(url, JSON.stringify(options), headers)
        .subscribe((data : any) =>
        {
          console.log("lat and long was sent to the database");
        },
        (error : any) =>
        {
            console.log(error);
        });
     }

     //method for sending the latitude and longitude of each pothole marker creater,
     //to the MySQL database to be saved 
     sendPotholeData(lat, long){
      let headers : any = new HttpHeaders({ 'Content-Type': 'application/json' }),
          options : any = { "key" : "create", "latitude" : lat, "longitude" : long },
          url : any = this.baseURI + "sendPotholeData.php";
  
      this.http.post(url, JSON.stringify(options), headers)
      .subscribe((data : any) =>
      {
        console.log("lat and long was sent to the database");
      },
      (error : any) =>
      {
          console.log(error);
      });
   }

   validateLogin(username: any, password: any){
    let headers : any = new HttpHeaders({ 'Content-Type': 'application/json' }),
      options : any = {"username" : username, "password" : password },
      url : any = this.baseURI + "login.php";

    this.http.post(url, JSON.stringify(options), headers)
    .subscribe((data: any) => {
      console.log("checking login details")

      if(data == "Your Login success")
      {
        console.log("Username and password found");
      }
      else{
        console.log("Not found");
      }
    },
    (error : any) =>
    {
      console.log(error);
    });
   }
}
