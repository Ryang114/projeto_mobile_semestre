import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sobre-nos',
  templateUrl: './sobre-nos.page.html',
  styleUrls: ['./sobre-nos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SobreNosPage implements OnInit {

constructor(
  private navCtrl: NavController,
  private router: Router
) {
  addIcons({ 'chevron-back-outline': chevronBackOutline });
}

  ngOnInit() { }

  voltar() {
    this.router.navigate(['/configuracoes'], { replaceUrl: true });
  }

  abrirPerfil(idDev: string) {
    this.navCtrl.navigateForward(['/perfil-dev', idDev]);
  }
}
