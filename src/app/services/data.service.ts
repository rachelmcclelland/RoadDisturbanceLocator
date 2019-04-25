import { Injectable, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx'; 
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { LoginService } from '../services/login.service';
import { HomePage } from '../home/home.page';

@Injectable({
  providedIn: 'root'
})
export class DataService {

    //private baseURI : string  = "http://localhost/";
    private baseURI : string  = "http://34.253.107.97/";
    data2: any;
    state: any;
    

    constructor(private http: HttpClient, public login: LoginService, public navCtrl: NavController,
                    private alertCtrl: AlertController) { }

    //return all the accident markers from the MySQL database
    getAccidentMarkers() : Observable<any>{
    
      var url = this.baseURI + 'getAccidentData.php'
      return this.http.get(url);
    }// getAccidentMarkers
    
    //return all pothole from the database
    getPotholeMarkers() : Observable<any>{
    
      var url = this.baseURI + 'getPotholeData.php'
      return this.http.get(url);
    } //getPotholeMarkers

    /** method for sending the latitude and longitude of an accident marker placed 
     * by a user, to the MySQL database through the .php file */
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
    }// sendAccidentData

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
    }// sendPotholeData

    //send the username and password to the database to be compared against
    // the username and password in the database
    validateLogin(username: any, password: any){
      let headers : any = new HttpHeaders({ 'Content-Type': 'application/json' }),
        options : any = {"username" : username, "password" : password },
        url : any = this.baseURI + "login.php";

      this.http.post(url, JSON.stringify(options), headers)
      .subscribe((res) => {
        console.log("Valid username and password")

        console.log(res);
        
        this.login.loginState = true;

          this.navCtrl.navigateForward('/home');
      },
      async (error : any) =>
      {
        // display error message if the username and password does not match
        console.log("Invalid username");
        this.login.loginState = false;
        
        var alert = await this.alertCtrl.create({
          header:"Error",
          subHeader:"Your Login Username or Password is invalid",
          buttons: ['OK']
        });

        await alert.present();
      });

    } //validateLogin

    saveNoteData(id, notes, key)
    {
      //save the note from the pothole into the database with the corresponding
      // pothole in the database
      let headers : any = new HttpHeaders({ 'Content-Type': 'application/json' }),
          options : any = {"key": key, "id" : id, "notes" : notes},
          url : any = this.baseURI + "sendNoteData.php";
  
      this.http.post(url, JSON.stringify(options), headers)
      .subscribe((data : any) =>
      {
        console.log("notes was sent to database");
      },
      (error : any) =>
      {
          console.log(error);
      });
    }// saveNoteData

    /**
     * This method is used with the checkbox to get the accident markers
     * in the database from the last two weeks
     */
    viewAccidents2Weeks() : Observable<any>
    {
      var url = this.baseURI + 'viewAccidents2weeks.php'
      return this.http.get(url);
    }// viewAccident2Weeks
}
