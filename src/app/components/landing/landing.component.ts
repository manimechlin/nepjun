import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services';
import {Location } from '@angular-material-extensions/google-maps-autocomplete';
import {} from 'googlemaps';
import PlaceResult = google.maps.places.PlaceResult;
import { User } from 'src/app/models';
import { setItem } from 'src/app/utils/storage';
import  { environment } from '../../../environments/environment'
import { ModalService } from '../../_modal';
declare var Plyr: any;
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LandingComponent implements OnInit {
  @Input() locationSection: boolean;
  @Input() user: User;
  @Output() gotoServices = new EventEmitter();
  enabledConfirm = false;
  volunteerUrl = environment.VOLUNTEER;
  player: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    
  }
  
  ngAfterViewInit()
  {
    this.player = new Plyr('#player');
  }
    openModal(id: string) {
      this.player.play();
      this.modalService.open(id);
  }

  closeModal(id: string) {
      this.player.stop();
      this.modalService.close(id);
  }

  // verifyClient() {
  //   this.apiService.get(`/mapWebView/access/nyfoodbank`)
  //     .subscribe(response => {
  //       if (response.status === 'true') {
  //         console.log(response);
  //         this.client = response.data;
  //         setItem('client', this.client);
  //       } else {
  //         this.router.navigate(['map/error']);
  //       }
  //     }, (err) => {
  //       if (err === 'Unauthorized') {
  //         this.router.navigate(['map/error']);
  //       }
  //   })
  // }

  onAutocompleteSelected(result: PlaceResult) {
    console.log('onAutocompleteSelected: ', result);
    this.enabledConfirm = false;
    this.user.location = result.formatted_address;
    const zipcode = result.address_components.filter(elem => elem.types[0] === 'postal_code')
    if (zipcode && zipcode.length>0) {
      console.log(zipcode)
      this.user.location_zipcode = zipcode[0].long_name;
      this.enabledConfirm = true;
    }
  }
 
  onLocationSelected(location: Location) {
    console.log('onLocationSelected: ', location);
    this.user.latitude = location.latitude;
    this.user.longitude = location.longitude;
  }

  onKeyupBackspace(event) {
    this.user.location = event.target.value
  }

  updateLocation() {
    if (this.user.userid != 0) {
      this.apiService.post(`/user/location`, this.user)
      .subscribe(res => {
        console.log(res)
      })
    }
    setItem('user', this.user)
  }

  onConfirmLocation() {
    this.updateLocation()
    this.gotoServices.emit(this.user)
    this.enabledConfirm = false;
  }

  onLogin() {
    this.router.navigate([`session/signin`]);
  }

  onSignup() {
    this.router.navigate([`session/signup`]);
  }

  logout()
  {
     localStorage.clear();
    this.router.navigate([`location`]).then(()=>{
      window.location.reload()
    })
  }


}
