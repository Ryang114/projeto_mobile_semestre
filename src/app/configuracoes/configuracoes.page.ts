import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, 
  IonTabBar, IonTabButton, IonIcon,
  IonList, IonItem, IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
// 1. IMPORTAMOS OS ÍCONES DO MENU QUE ESTAVAM FALTANDO AQUI
import { 
  moonOutline, 
  alarm, 
  settingsOutline, 
  personCircleOutline, 
  timeOutline, 
  informationCircleOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, IonContent, IonHeader, 
    IonTitle, IonToolbar, IonFooter, IonTabBar, IonTabButton, IonIcon,
    IonList, IonItem, IonLabel 
  ]
})
export class ConfiguracoesPage implements OnInit {

  constructor() {
    // 2. REGISTRAMOS OS ÍCONES AQUI DENTRO DO CONSTRUTOR
    addIcons({ 
      'moon-outline': moonOutline, 
      'alarm': alarm, 
      'settings-outline': settingsOutline,
      'person-circle-outline': personCircleOutline,
      'time-outline': timeOutline,
      'information-circle-outline': informationCircleOutline
    });
  }

  ngOnInit() {
  }
}