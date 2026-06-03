import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonButton, IonIcon, IonFooter, IonTabBar, IonTabButton, IonFab, IonFabButton, IonPopover, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { optionsOutline, moonOutline, alarm, settingsOutline, add, personCircleOutline, funnel } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonButton, IonIcon, IonFooter, IonTabBar, IonTabButton, IonFab, IonFabButton, IonPopover, IonList, IonItem, IonLabel, RouterModule],
})
export class HomePage {
  filtroSelecionado = 'todos';
  ordemSelecionada = 'proximo';
  isLoggedIn$: Observable<boolean>;

  constructor(private auth: AuthService) {
    addIcons({
      'options-outline': optionsOutline,
      'moon-outline': moonOutline,
      'alarm': alarm,
      'settings-outline': settingsOutline,
      'add': add,
      'person-circle-outline': personCircleOutline,
      'funnel': funnel
    });
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  selecionarOrdem(tipo: string) {
    this.ordemSelecionada = tipo;
    console.log('Selecionado:', tipo);
  }
}
