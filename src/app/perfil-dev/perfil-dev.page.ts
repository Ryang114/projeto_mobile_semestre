import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { logoGithub, mailOutline, chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-perfil-dev',
  templateUrl: './perfil-dev.page.html',
  styleUrls: ['./perfil-dev.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class PerfilDevPage implements OnInit {
//-- APAGA NAO VIADO--//
  idDev: string = '';
  chevronBackOutline = chevronBackOutline;
  nomeDev: string = '';
  funcaoDev: string = '';
  fotoDev: string = '';
  notaDev: string = '';
  githubUrl: string = '';
  RaUrl: string = '';
  emailUrl: string = '';
  emailDestino: string = '';
  modalEmailAberto: boolean = false;
  emailCopiado: boolean = false;
  mostrarGithub: boolean = false;
  mostrarRa: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {
    addIcons({ logoGithub, mailOutline, chevronBackOutline });
  }

  ngOnInit() {
    this.idDev = this.route.snapshot.paramMap.get('idDev') || '';
    this.carregarDados();
  }

  carregarDados() {
    if (this.idDev === 'adriano') {
      this.nomeDev = 'Adriano Feliciano';
      this.funcaoDev = 'Design de software';
      this.fotoDev = 'assets/imagens/Adriano.jpeg';
      this.notaDev = 'Gosto de gatos e de platinar jogos.';
      this.githubUrl = 'https://github.com/bl4dd';
      this.emailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=bladdfc@gmail.com';
      this.emailDestino = 'bladdfc@gmail.com';
      this.mostrarGithub = true;
      this.RaUrl = 'https://retroachievements.org/user/receita';
      this.mostrarRa = true;
    } else if (this.idDev === 'ryan') {
      this.nomeDev = 'Ryan Gomes';
      this.funcaoDev = 'Desenvolvedor';
      this.fotoDev = 'assets/imagens/ryan.jpeg';
      this.notaDev = 'Desenvolvedor Fullstack em formação.';
      this.githubUrl = 'https://github.com/Ryang114';
      this.emailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=ryanzin04113@gmail.com';
      this.emailDestino = 'ryanzin04113@gmail.com';
      this.mostrarGithub = true;
    } else if (this.idDev === 'pablo') {
      this.nomeDev = 'Pablo Vinícius';
      this.funcaoDev = 'Desenvolvedor';
      this.fotoDev = 'assets/imagens/pablo.jpeg';
      this.notaDev = 'lelé da cuca';
      this.githubUrl = 'https://github.com/Westzi';
      this.emailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=pabloviniciusog@gmail.com';
      this.emailDestino = 'pabloviniciusog@gmail.com';
      this.mostrarGithub = true;
    }
  }

  voltar() {
    this.navCtrl.navigateBack('/sobre-nos', { animated: false });
  }

  abrirGithub() {
    if (this.githubUrl) {
      window.open(this.githubUrl, '_blank');
    }
  }

  abrirRA() {
    if (this.RaUrl) {
      window.open(this.RaUrl, '_blank');
    }
  }

  abrirEmail() {
    this.emailCopiado = false;
    this.modalEmailAberto = true;
    document.body.classList.add('email-modal-open');
  }

  fecharModalEmail() {
    this.modalEmailAberto = false;
    this.emailCopiado = false;
    document.body.classList.remove('email-modal-open');
  }

  async copiarEmail() {
    if (!this.emailDestino) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(this.emailDestino);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = this.emailDestino;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      this.emailCopiado = true;
    } catch (error) {
      this.emailCopiado = false;
    }
  }

  abrirGmail() {
    if (this.emailUrl) {
      window.open(this.emailUrl, '_blank', 'noopener,noreferrer');
    }
    this.fecharModalEmail();
  }
}
