import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  mailOutline,
  keyOutline,
  eyeOutline,
  eyeOffOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { IonContent, IonButton, IonIcon, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.page.html',
  styleUrls: ['./conta.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, CommonModule, FormsModule]
})
export class ContaPage implements OnInit {
  abaAtiva: 'entrar' | 'criar' = 'entrar';

  emailLogin = '';
  senhaLogin = '';

  emailCriar = '';
  senhaCriar = '';
  confirmarSenhaCriar = '';

  mostrarSenha = false;
  mostrarConfirmarSenha = false;

  erroEmail = '';
  erroSenha = '';
  erroConfirmar = '';

  mostrarPopupSucesso = false;

  constructor(private navCtrl: NavController) {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'mail-outline': mailOutline,
      'key-outline': keyOutline,
      'eye-outline': eyeOutline,
      'eye-off-outline': eyeOffOutline,
      'checkmark-circle-outline': checkmarkCircleOutline
    });
  }

  ngOnInit() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado === 'true') {
      this.navCtrl.navigateRoot('/conta_logada');
    }
  }

  voltar() {
    this.navCtrl.navigateBack('/configuracoes', { animated: false });
  }

  trocarAba(aba: 'entrar' | 'criar') {
    this.abaAtiva = aba;
    this.limparErros();
  }

  limparErros() {
    this.erroEmail = '';
    this.erroSenha = '';
    this.erroConfirmar = '';
  }

  alternarVisibilidadeSenha(tipo: 'senha' | 'confirmar') {
    if (tipo === 'senha') {
      this.mostrarSenha = !this.mostrarSenha;
    } else {
      this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
    }
  }

  entrar() {
    this.limparErros();
    let temErro = false;

    if (!this.emailLogin) {
      this.erroEmail = 'Email incorreto';
      temErro = true;
    }
    if (!this.senhaLogin) {
      this.erroSenha = 'Senha incorreta';
      temErro = true;
    }

    if (temErro) return;

    const contaSalvaString = localStorage.getItem('contaApp');
    if (contaSalvaString) {
      const contaSalva = JSON.parse(contaSalvaString);
      // Compara credenciais
      if (this.emailLogin.toLowerCase() === contaSalva.email.toLowerCase() && this.senhaLogin === contaSalva.senha) {
        localStorage.setItem('usuarioLogado', 'true');
        this.navCtrl.navigateRoot('/home', { animated: false });
      } else {
        this.erroEmail = 'Email incorreto';
        this.erroSenha = 'Senha incorreta';
      }
    } else {
      this.erroEmail = 'Email incorreto';
      this.erroSenha = 'Senha incorreta';
    }
  }

  criarConta() {
    this.limparErros();
    let temErro = false;

    // 1. Validação de formato básico
    if (!this.emailCriar || !this.emailCriar.includes('@')) {
      this.erroEmail = 'Formato de email inválido';
      temErro = true;
    } else {

      const contaExistenteString = localStorage.getItem('contaApp');
      if (contaExistenteString) {
        const contaExistente = JSON.parse(contaExistenteString);

        if (this.emailCriar.toLowerCase() === contaExistente.email.toLowerCase()) {
          this.erroEmail = 'Este email já está cadastrado';
          temErro = true;
        }
      }
    }


    if (!this.senhaCriar || this.senhaCriar.length < 3 || this.senhaCriar.length > 150) {
      this.erroSenha = 'A senha deve ter mais de 3 caracteres';
      temErro = true;
    }


    if (this.senhaCriar !== this.confirmarSenhaCriar) {
      this.erroConfirmar = 'As senhas não coincidem';
      temErro = true;
    }

    if (temErro) return;

    const novaConta = { email: this.emailCriar, senha: this.senhaCriar };
    localStorage.setItem('contaApp', JSON.stringify(novaConta));

    this.mostrarPopupSucesso = true;
  }

  irParaEntrar() {
    this.mostrarPopupSucesso = false;
    this.abaAtiva = 'entrar';
    this.emailLogin = this.emailCriar;
    this.senhaCriar = '';
    this.confirmarSenhaCriar = '';
  }
}
