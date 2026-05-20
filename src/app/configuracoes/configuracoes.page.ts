import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonTabBar, IonTabButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
// ADICIONE OS DOIS NOVOS ÍCONES NA LISTA ABAIXO:
import { moonOutline, alarm, settingsOutline, personCircleOutline, timeOutline, informationCircleOutline} from 'ionicons/icons';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: true,
<<<<<<< HEAD
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonTabBar, IonTabButton, IonIcon, IonList, IonItem, IonLabel, CommonModule, FormsModule, RouterModule], 
=======
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonTabBar, IonTabButton, IonIcon, IonList, IonItem, IonLabel, CommonModule, FormsModule, RouterModule],
>>>>>>> 91438e13e8f4e9c33d0634fcb451f26165c2b06b
})
export class ConfiguracoesPage implements OnInit {

  constructor() {
    // Agora o código abaixo vai funcionar porque os nomes foram importados lá em cima
<<<<<<< HEAD
    addIcons({ 
      'moon-outline': moonOutline, 
      'alarm': alarm, 
      'settings-outline': settingsOutline, 
      'person-circle-outline': personCircleOutline, 
=======
    addIcons({
      'moon-outline': moonOutline,
      'alarm': alarm,
      'settings-outline': settingsOutline,
      'person-circle-outline': personCircleOutline,
>>>>>>> 91438e13e8f4e9c33d0634fcb451f26165c2b06b
      'time-outline': timeOutline ,
      'information-circle-outline': informationCircleOutline
    });
  }

  ngOnInit() { }
<<<<<<< HEAD
}
=======
}
>>>>>>> 91438e13e8f4e9c33d0634fcb451f26165c2b06b
