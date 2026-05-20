import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// IMPORTANTE: Trocamos FormsModule por ReactiveFormsModule
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
  IonButton, IonIcon, IonFooter, IonTabBar, IonTabButton, 
  IonFab, IonFabButton, IonPopover, IonList, IonItem, IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { optionsOutline, moonOutline, alarm, settingsOutline, add, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home-logado',
  templateUrl: './home-logado.page.html',
  styleUrls: ['./home-logado.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, // <-- Adicionado aqui
    RouterModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonButton, 
    IonIcon, 
    IonFooter, 
    IonTabBar, 
    IonTabButton, 
    IonFab, 
    IonFabButton, 
    IonPopover, 
    IonList, 
    IonItem, 
    IonLabel
  ]
})
export class HomeLogadoPage implements OnInit {
  // Criamos o controle do formulário de forma reativa
  perfilForm!: FormGroup;
  emailUsuario: string | null = '';

  constructor() {
    addIcons({ 
      'options-outline': optionsOutline, 
      'moon-outline': moonOutline, 
      'alarm': alarm, 
      'settings-outline': settingsOutline, 
      'add': add,
      'person-circle-outline': personCircleOutline
    });
  }

  ngOnInit() {
    // Recupera o email salvo no banco local
    this.emailUsuario = localStorage.getItem('emailUsuarioAtual') || 'usuario@teste.com';

    // Inicializa o formulário com o valor do email
    this.perfilForm = new FormGroup({
      email: new FormControl(this.emailUsuario)
    });
  }

  ordenar(tipo: string) {
    console.log('Ordenando área logada por:', tipo);
  }

  criarAlarme() {
    console.log('Ação para criar novo alarme.');
  }
}