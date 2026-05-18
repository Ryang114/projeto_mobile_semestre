import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular'; 
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sobre-nos',
  templateUrl: './sobre-nos.page.html',
  styleUrls: ['./sobre-nos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] 
})
export class SobreNosPage implements OnInit {

  constructor(private navCtrl: NavController) { 
    // --- 2. REGISTRAR O ÍCONE DA SETA NO CONSTRUTOR ---
    addIcons({ 'arrow-back-outline': arrowBackOutline });
  }

  ngOnInit() { }

  abrirPerfil(idDev: string) {
    this.navCtrl.navigateForward(['/perfil-dev', idDev]);
  }
}