import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx'; 
import { HttpClient} from '@angular/common/http';
import {DataService} from '../services/data.service';
import { LoginService } from '../services/login.service';
import { AlertController } from '@ionic/angular';
import * as $ from "jquery";
import {NavController} from '@ionic/angular';
import { GoogleMap} from '@ionic-native/google-maps';

declare var google;
//declare var MarkerCluster: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // variables used throughout the file
  options : GeolocationOptions;
  currentPos : Geoposition;
  lat : any;
  long : any;
  accMarkers: any;
  potMarkers: any;
  markerCluster: any;
  markers :any[];
  hidden: any;
  map: GoogleMap;
  infoWindows: any;
  isFixed: any;
  item: any;
  pMarkers: any;

  autocomplete:any;
  latitude: number;
  longitude: number;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;  

  @ViewChild('map') mapElement: ElementRef;

  //constructor
  constructor(public geolocation: Geolocation, public http: HttpClient, private service:DataService, 
    public login:LoginService, private alertCtrl: AlertController, public zone: NgZone) 
  {
      this.infoWindows = [];
  }

  ionViewWillEnter(){
    this.getUserPosition(); 
    console.log(this.login.loginState);
  } //ionViewWillEnter

  getUserPosition(){
    // this method will find the users position on the map
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
  }// getUserPosition

  public loadMap(lat, long){
 
      let latLng = new google.maps.LatLng(lat, long);

      let mapOptions = {
        center: latLng, //where we want the centre of the map to be
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP //road style map
      }

      // create a new instance of google maps
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // add markers to the map with these methods
      this.addUserMarker(lat, long);

      this.addAccidentMarkers();

      this.addPotholeMarkers(this.map);

  }// loadMap

  public addUserMarker(lat: number, lng: number): void {

    // this method will add a marker for the users position using the latitude
    // and longitude from the getUserPosition method
    let latLng = new google.maps.LatLng(lat, lng);

    let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        title: 'Your location'
    });
  }// addUserMarker

  public addAccidentMarkers(){
    //this method goes out to the service to get all the accident
    // markers that are currently in the database
    this.service.getAccidentMarkers().subscribe(data => 
      {
        this.accMarkers = data;
        console.dir(this.accMarkers);

        // loop through all the markers and create a new accident marker
        // based on the lat and long of each of them
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
  }// addAccidentMarkers

  public addNewAccidentMark(){
    // this method if fired when the user clicks on the accident marker button
    // on the map which will allow the user to add another marker to the database
    let latLng = new google.maps.LatLng(this.currentPos.coords.latitude, this.currentPos.coords.longitude);

    //create the marker
    let marker2 = new google.maps.Marker({
      map: this.map,
      title: 'Accident',
      animation: google.maps.Animation.DROP,
      draggable:true, //allow it to be draggable so the user can move it to the location they want
      position: latLng,
      icon: '../../assets/Images/Markers/yellow_MarkerA.png'
    })
  
    // once the user has finished dragging it, get the position of the marker and
    // send it to the service to be saved in the database
    google.maps.event.addListener(marker2, 'dragend', event => {
      this.lat = event.latLng.lat();
      this.long = event.latLng.lng();

      this.service.sendAccidentData(this.lat, this.long);
    })  
}// addNewAccidentMarker

  public addPotholeMarkers(map)
  {
    // this method works the same as the addAccidentMarkers
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
            markNo : this.potMarkers[i].id, // the id of each marker
            potholeNote: this.potMarkers[i].notes, // notes that will be displayed in info window
            isFixed: this.potMarkers[i].isFixed // if its fixed or not (the checkbox on info window)
          })

          //pass each marker into the this method to add an info window
          this.addInfoWindowToMarker(marker);

          // if the marker was previouslt checked that is was fixed, change the image to
          // be a green marker
          if(marker.isFixed == 1)
          {
            marker.icon = '../../assets/Images/Markers/green_MarkerP.png'
          }
          
          this.markers += marker;
        }
      }); 

      // NOT WORKING
      let clusterOptions = {
        markers: this.markers,
        icons: [
          {min: 2, max: 100, url: "../../assets/Clusters/potholecluster.png", anchor: {x: 16, y: 16}}
        ]
      }
     // var markerCluster = new MarkerCluster(map, clusterOptions);
  }// addPotholeMarkers

  addNewPotholeMark(){

    //this method works the same as the addNewAccidentMark
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

  }// addNewPotholeMark

  addInfoWindowToMarker(marker)
  {
    /**
     * https://www.christianengvall.se/google-map-marker-infowindow/
     */

     var fixed = 0;
     var str: string;
     var check: string;

     // leave blank if no note
     if(marker.potholeNote == null)
     {
        str = ""
     }
     else{
       str = marker.potholeNote;
     }

     // hide edit button if admin is not logged in
     if(this.login.loginState)
     {
       //if logged in, user can see checkbox for fixing pothole
        this.hidden = "";

        if(marker.isFixed == 1)
        {
          check = "checked";
        }
        else{
          check = ""
        }

        str += '<br> Fixed: <input type = "checkbox" name = "fixable" value="Fixed" ' + check + '>' +
                '<ion-button button id = "save">Save</ion-button>';
     }
     else{ // else hide it
       this.hidden = 'style="display:none;"';
     }

    var infoWindowContent = str + 
                      '<br> <ion-button button id = "click"' + this.hidden + '>Add a note</ion-button>';
    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    marker.addListener('click', () => {
      this.closeAllInfoWindows(); // close other info windows when user clicks on a marker
      infoWindow.open(this.map, marker); //open certain markers info window

      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {

        try{
          //JQUERY
          $(document).ready(function(){
            $('input[type=checkbox]').click(function(){
                if($(this).is(':checked')){
                    fixed = 1;                    
                }   
                else {
                  fixed = 0;
                }
            }); 
          });

          //update the pothole in the database for whether the pothole is fixed or not
          document.getElementById('save').addEventListener('click', () => {
            this.updatePotholeDatabase(marker.markNo, fixed);
          }); //addEventListener

          document.getElementById('click').addEventListener('click', () => {
            this.saveNote(marker.markNo);
            });
        }
        catch{
          //do nothing
        }
      });
    });

    this.infoWindows.push(infoWindow);
  }// addInfoWindowToMarker

  closeAllInfoWindows() {
    for(let window of this.infoWindows) {
      window.close();
    }
  }// closeAllInfoWindows

  async saveNote(markerNo)
  {
    // this method is used to create a pop up box so the user can 
    // edit the note of a pothole
    var alert = await this.alertCtrl.create({
      header: 'Create note',
      subHeader: 'Enter in details about the pothole',
      inputs: [
        {
          name: 'note'
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
            //send the note to the database to be saved with the pothole
            this.sendNoteToDatabase(markerNo, data.note);
          }
        }
      ]
    });
    await alert.present();
  }// saveNote

  sendNoteToDatabase(markerNo, data)
  {
    this.service.saveNoteData(markerNo, data, "notes");
    this.ionViewWillEnter();
  }//sendNoteToDatabase

  public updatePotholeDatabase(markerNo, fixed)
  {
    this.service.saveNoteData(markerNo, fixed, "checkbox");
  }// updatePotholeDatabase

  public toggleCheckbox(event){

    //if the user clicks on the checkbox on the map, display all 
    // accident markers for the past two weeks
    if(event.target.checked == false)
    {
        this.service.viewAccidents2Weeks().subscribe(data => 
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
    else{
      //reload the map
      this.ionViewWillEnter()
    }
  }// toggleCheckbox

/* selectPlace(place){

    console.log(place)

    this.places = [];

    let location = {
        lat: null,
        lng: null,
        name: place.name
    };

    this.placesService.getDetails({placeId: place.place_id}, (details) => {

        this.zone.run(() => {

            location.name = details.name;
            location.lat = details.geometry.location.lat();
            location.lng = details.geometry.location.lng();
            this.saveDisabled = false;

            let latLng = new google.maps.LatLng(location.lat, location.lng);

            //this.map.center({lat: location.lat, lng: location.lng}); 
            this.map.setOptions({
              center: latLng
            });

            this.location = location;

        });

    });

}
 */

searchPlace(location: string){

  let lat: any;
  let long: any;
  let num : any = 0;
  console.log(location)

  // use Geocoder to get the lat and long of the address that the
  // user has entered
  var geocoder = new google.maps.Geocoder();
  
        geocoder.geocode({'address': location}, function(results, status) {
          if (status === 'OK') {
 
            console.log("here")
            console.log(results)
            
            num = 1;
            console.log(results[0].geometry.location.lat())
            lat = results[0].geometry.location.lat()

            console.log(results[0].geometry.location.lng())
            long = results[0].geometry.location.lng()

            // move the map to the location the user has entered
            var map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: lat, lng: long},
              zoom: 14
            });
            

          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });

}// searchPlace

}
