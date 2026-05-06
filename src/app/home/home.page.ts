import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonButton, IonIcon, IonFooter, IonTabBar, IonTabButton, IonFab, IonFabButton, IonPopover, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { optionsOutline, moonOutline, alarm, settingsOutline, add } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonButton, IonIcon, IonFooter, IonTabBar, IonTabButton, IonFab, IonFabButton, IonPopover, IonList, IonItem, IonLabel, RouterModule],
})
export class HomePage {
  constructor() {

    addIcons({ 'options-outline': optionsOutline, 'moon-outline': moonOutline, 'alarm': alarm, 'settings-outline': settingsOutline, 'add': add });
  }

  ordenar(tipo: string) {
    console.log('Ordenando por:', tipo);
    
  }

}
