import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-conta',
  templateUrl: './conta.page.html',
  styleUrls: ['./conta.page.scss'],
  standalone: true, 
  imports: [IonicModule, FormsModule, CommonModule] 
})
export class ContaPage {
  // Controle de Abas e Visibilidade de Senha
  abaAtiva: 'entrar' | 'criar' = 'entrar';
  mostrarSenha = false;
  mostrarConfirmarSenha = false;
  mostrarPopupSucesso = false;

  // Inputs da aba LOGIN
  emailLogin = '';
  senhaLogin = '';

  // Inputs da aba CRIAR CONTA
  emailCriar = '';
  senhaCriar = '';
  confirmarSenhaCriar = '';

  // Mensagens de Erro
  erroEmail = '';
  erroSenha = '';
  erroConfirmar = '';

  constructor(private router: Router) {}

  // Alterna entre as abas 'entrar' e 'criar' e limpa os erros
  trocarAba(aba: 'entrar' | 'criar') {
    this.abaAtiva = aba;
    this.limparErros();
  }

  // Mostra/Esconde as senhas nos inputs
  alternarVisibilidadeSenha(tipo: 'senha' | 'confirmar') {
    if (tipo === 'senha') {
      this.mostrarSenha = !this.mostrarSenha;
    } else if (tipo === 'confirmar') {
      this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
    }
  }

  // Lógica de Criar Conta (Cadastro)
  criarConta() {
    this.limparErros();

    // 1. Validações básicas
    if (!this.emailCriar.includes('@')) {
      this.erroEmail = 'Insira um e-mail válido.';
      return;
    }
    if (this.senhaCriar.length < 6) {
      this.erroSenha = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }
    if (this.senhaCriar !== this.confirmarSenhaCriar) {
      this.erroConfirmar = 'As senhas não coincidem.';
      return;
    }

    // 2. Salva os dados localmente
    const novoUsuario = {
      email: this.emailCriar,
      senha: this.senhaCriar
    };
    
    localStorage.setItem('usuarioLocal', JSON.stringify(novoUsuario));

    // 3. Abre o seu popup customizado do HTML
    this.mostrarPopupSucesso = true;
  }

  // Lógica de Entrar (Login)
  entrar() {
    this.limparErros();

    // Busca o usuário que foi cadastrado no localStorage
    const usuarioSalvo = localStorage.getItem('usuarioLocal');

    if (!usuarioSalvo) {
      this.erroEmail = 'Nenhum usuário cadastrado neste dispositivo.';
      return;
    }

    const conta = JSON.parse(usuarioSalvo);

    // Valida as credenciais
    if (this.emailLogin !== conta.email) {
      this.erroEmail = 'E-mail não encontrado.';
      return;
    }

    if (this.senhaLogin !== conta.senha) {
      this.erroSenha = 'Senha incorreta.';
      return;
    }

    
    this.router.navigate(['/home']); 
  }

  // Função do botão do seu Popup de Sucesso
  irParaEntrar() {
    this.mostrarPopupSucesso = false;
    this.limparCamposCadastro();
    this.trocarAba('entrar'); // Te joga para a aba de login
  }

  // Botão voltar do topo da tela
  voltar() {
    // Ajuste para a rota anterior do seu app se necessário (ex: /welcome ou /home)
    this.router.navigate(['/home']); 
  }

  // Auxiliares para limpar o estado da tela
  private limparErros() {
    this.erroEmail = '';
    this.erroSenha = '';
    this.erroConfirmar = '';
  }

  private limparCamposCadastro() {
    this.emailCriar = '';
    this.senhaCriar = '';
    this.confirmarSenhaCriar = '';
  }
}