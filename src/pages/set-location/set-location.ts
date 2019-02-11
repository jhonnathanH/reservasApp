import { Component } from '@angular/core';
import { NavParams, ViewController } from "ionic-angular";
import { LocationField } from '../../models/locationField';


@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html'
})
export class SetLocationPage {
  location: LocationField;
  marker: LocationField;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController) {
    this.location = this.navParams.get('location');
    if (this.navParams.get('isSet')) {
      this.marker = this.location;
    }
  }

  onSetMarker(event: any) {
    console.log(event);
    this.marker = new LocationField(event.coords.lat, event.coords.lng);
  }

  onConfirm() {
    this.viewCtrl.dismiss({location: this.marker});
  }

  onAbort() {
    this.viewCtrl.dismiss();
  }
}
