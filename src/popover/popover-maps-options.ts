import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
    selector: 'page-popover-maps-option',
    template: `
                 <ion-grid>
                    <ion-row>
                      <ion-col class="custom-popover">
                        <button ion-button full small clear  (click)="onAction('show')">
                           Mostrar Canchas
                        </button>
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col class="custom-popover">
                        <button ion-button full small clear  (click)="onAction('create')">
                           Crear Canchas
                        </button>
                      </ion-col>
                    </ion-row>
                 </ion-grid>
              `
})

export class PopOverMapsPage {
    constructor(private viewCtrl: ViewController) {
    }

    onAction(option: string) {
        this.viewCtrl.dismiss({action:option});
    }
}