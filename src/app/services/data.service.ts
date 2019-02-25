import { Injectable, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

    public items : Array<any> = [];
    private baseURI : string  = "http://localhost/";

    constructor(private http: HttpClient) { }

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
    
        //console.log(this.items);
    }

    sendData(lat, long){
        let headers : any = new HttpHeaders({ 'Content-Type': 'application/json' }),
            options : any = { "key" : "create", "latitude" : lat, "longitude" : long },
            url : any = this.baseURI + "sendData.php";
    
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
}
