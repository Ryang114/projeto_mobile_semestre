import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    ReactiveFormsModule, 
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
    this.emailUsuario = localStorage.getItem('usuarioLogado');

    // Inicializa o formulário reativo com o email recuperado
    this.perfilForm = new FormGroup({
      email: new FormControl(this.emailUsuario || '')
    });
  }

  // === COLE ESTA FUNÇÃO AQUI (LOGO ABAIXO DO ngOnInit) ===
  getIniciaisUsuario(): string {
    const email = this.perfilForm?.get('email')?.value;
    if (!email) return '??'; // Se não houver email, mostra pontos de interrogação

    // Pega tudo o que vem antes do '@' (ex: ryan.gomes)
    const parteAntesDoAt = email.split('@')[0];
    
    // Remove pontos, números ou traços para garantir que pegamos apenas letras
    const apenasLetras = parteAntesDoAt.replace(/[^a-zA-Z]/g, '');

    // Se tiver 2 ou mais letras, pega as 2 primeiras
    if (apenasLetras.length >= 2) {
      return apenasLetras.substring(0, 2).toUpperCase();
    } else if (apenasLetras.length === 1) {
      return apenasLetras.toUpperCase();
    }
    
    // Caso de segurança: se o nome antes do @ for só números, pega as primeiras letras do email original
    return email.substring(0, 2).toUpperCase();
  }

  ordenar(tipo: string) {
    console.log('Ordenando por:', tipo);
  }

  criarAlarme() {
    console.log('Criar alarme clicado');
  }
}