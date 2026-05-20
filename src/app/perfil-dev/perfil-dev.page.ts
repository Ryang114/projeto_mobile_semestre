import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; 
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { logoGithub, mailOutline } from 'ionicons/icons';

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
  nomeDev: string = '';
  funcaoDev: string = '';
  fotoDev: string = '';
  notaDev: string = '';
  githubUrl: string = ''; 
  mostrarGithub: boolean = false;
  mostrarRa: boolean = false;

  constructor(private route: ActivatedRoute) {
  
    addIcons({ logoGithub, mailOutline });
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
      this.notaDev = 'Focado em UX/UI e estrutura.';
      this.githubUrl = 'https://github.com/bl4dd'; 
      this.mostrarGithub = true;
      this.mostrarRa = true;
    } else if (this.idDev === 'ryan') {
      this.nomeDev = 'Ryan Gomes';
      this.funcaoDev = 'Desenvolvedor';
      this.fotoDev = 'assets/imagens/ryan.jpeg';
      this.notaDev = 'Desenvolvedor Fullstack em formação.';
      this.githubUrl = 'https://github.com/Ryang114'; 
      this.mostrarGithub = true; 
    } else if (this.idDev === 'pablo') {
      this.nomeDev = 'Pablo Vinícius';
      this.funcaoDev = 'Desenvolvedor';
      this.fotoDev = 'assets/imagens/pablo.jpeg';
      this.notaDev = 'lelé da cuca';
      this.githubUrl = 'https://github.com/Westzi'; 
      this.mostrarGithub = true;
    }
  }

  abrirGithub() {
    if (this.githubUrl) {
      window.open(this.githubUrl, '_blank'); 
    }
  }
}