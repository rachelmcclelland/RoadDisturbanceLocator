import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx'; 
import { HttpClient} from '@angular/common/http';
import {DataService} from '../services/data.service';
import { LoginService } from '../services/login.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AlertController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  options : GeolocationOptions;
  currentPos : Geoposition;
  lat : any;
  long : any;
  accMarkers: any;
  potMarkers: any;
  markerCluster: any;
  markers :any[];
  hidden: any;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  infoWindows: any;

  constructor(public geolocation: Geolocation, public http: HttpClient, private service:DataService, 
    public login:LoginService, private alertCtrl: AlertController) 
  {
      this.infoWindows = [];
  }

  ionViewDidEnter(){
    this.getUserPosition();
    console.log(this.login.loginState);
  }

  getUserPosition(){
    this.options = {
        enableHighAccuracy : true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

        this.currentPos = pos;      
        console.log(pos);

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

      this.addUserMarker(lat, long);

      this.addAccidentMarkers();

      this.addPotholeMarkers();

  }

  public addUserMarker(lat: number, lng: number): void {

    let latLng = new google.maps.LatLng(lat, lng);

    let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        title: 'Your location'
    });
  }

  addAccidentMarkers(){
    this.service.getAccidentMarkers().subscribe(data => 
      {
        this.accMarkers = data;
        console.dir(this.accMarkers);

        for (let i = 0; i < this.accMarkers.length; i++)
        {
          let latLng = new google.maps.LatLng(this.accMarkers[i].latitude, this.accMarkers[i].longitude);
          
          let marker = new google.maps.Marker({
            map: this.map,
            title: 'Accident',
            animation: google.maps.Animation.DROP,
            draggable:true,
            position: latLng,
            icon: '../../assets/Images/Markers/yellow_MarkerA.png'
          })
        }
      }); 
  }

  addNewAccidentMark(){
    let latLng = new google.maps.LatLng(this.currentPos.coords.latitude, this.currentPos.coords.longitude);

    let marker2 = new google.maps.Marker({
      map: this.map,
      title: 'Accident',
      animation: google.maps.Animation.DROP,
      draggable:true,
      position: latLng,
      icon: '../../assets/Images/Markers/yellow_MarkerA.png'
    })
  
    google.maps.event.addListener(marker2, 'dragend', event => {
      this.lat = event.latLng.lat();
      this.long = event.latLng.lng();

      this.service.sendAccidentData(this.lat, this.long);
    })  
}

  addPotholeMarkers()
  {
    this.service.getPotholeMarkers().subscribe(data => 
      {
        this.potMarkers = data;
        console.dir(this.potMarkers);

        for (let i = 0; i < this.potMarkers.length; i++)
        {
          let latLng = new google.maps.LatLng(this.potMarkers[i].latitude, this.potMarkers[i].longitude);
          
          let marker = new google.maps.Marker({
            map: this.map,
            title: 'Pothole',
            animation: google.maps.Animation.DROP,
            draggable:true,
            position: latLng,
            icon: '../../assets/Images/Markers/orange_MarkerP.png',
            markNo : this.potMarkers[i].id,
            potholeNote: this.potMarkers[i].notes
          })

         // console.log(this.potMarkers[i].id);
          this.addInfoWindowToMarker(marker);
      //    this.markers += marker;

         // this.markerCluster = new MarkerClusterer(this.map, marker);
        }
      }); 

     // this.markerCluster = new MarkerClusterer(this.map, this.markers, {imagePath: '../../assets/Images/Markers/MapMarkerJS.png'});


  }

  addNewPotholeMark(){

    let latLng = new google.maps.LatLng(this.currentPos.coords.latitude, this.currentPos.coords.longitude);

    let marker = new google.maps.Marker({
      map: this.map,
      title: 'Pothole',
      animation: google.maps.Animation.DROP,
      draggable:true,
      position: latLng,
      icon: '../../assets/Images/Markers/orange_MarkerP.png'
    })

    google.maps.event.addListener(marker, 'dragend', event => {
      this.lat = event.latLng.lat();
      this.long = event.latLng.lng();

      this.service.sendPotholeData(this.lat, this.long);
    })  

    this.addInfoWindowToMarker(marker);

  }

  addInfoWindowToMarker(marker)
  {
    /**
     * https://www.christianengvall.se/google-map-marker-infowindow/
     */

     var str;
     
     if(this.login.loginState)
     {
        this.hidden = "";
     }
     else{
       this.hidden = 'style="display:none;"';
     }


     if(marker.potholeNote == null)
     {
        str = ""
     }
     else{
       str = marker.potholeNote;
     }

    var infoWindowContent = str + 
                      '<br> <ion-button button id = "click"' + this.hidden + '>Add a note</ion-button>';
    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
      console.log(marker.markNo);

      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        document.getElementById('click').addEventListener('click', () => {
        this.saveNote(marker.markNo);

        });
      });
    });
    this.infoWindows.push(infoWindow);
  }

  closeAllInfoWindows() {
    for(let window of this.infoWindows) {
      window.close();
    }
  }

  async saveNote(markerNo)
  {
    var alert = await this.alertCtrl.create({
      header: 'Create note',
      subHeader: 'Enter in details about the pothole',
      inputs: [
        {
          name: 'note',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data.note);
            this.doSomething(markerNo, data.note); //CHANGE NAME OF METHOD
          }
        }
      ]
    });
    await alert.present();
  }

  doSomething(markerNo, data)
  {
    this.service.saveNoteData(markerNo, data);
  }
}
