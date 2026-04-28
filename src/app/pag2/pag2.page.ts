import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonItem, IonInput, IonList, IonDatetime,
  IonButton 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-pag2',
  templateUrl: './pag2.page.html',
  styleUrls: ['./pag2.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonItem, IonInput, IonList, IonDatetime, 
    IonButton, 
    CommonModule, FormsModule 
  ]
})
export class Pag2Page {
  alarmName: string = ''; 
  alarmTime: string = ''; 

  constructor() {}

  salvarAlarme() {
    // Verificação básica se o usuário escolheu uma hora
    if (!this.alarmTime) {
      console.log('Por favor, selecione um horário!');
      return;
    }

    console.log('Nome do Alarme:', this.alarmName);
    console.log('Horário (ISO):', this.alarmTime);

    // Dica: para extrair apenas HH:mm
    const date = new Date(this.alarmTime);
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    
    console.log(`Alarme formatado: ${horas}:${minutos}`);
  }
}