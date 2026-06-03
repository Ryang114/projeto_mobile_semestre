import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  personOutline,
  mailOutline,
  keyOutline,
  eyeOutline,
  eyeOffOutline,
  checkmarkCircleOutline,
  logOutOutline
} from 'ionicons/icons';
import { IonContent, IonButton, IonIcon, NavController, AlertController, LoadingController } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { Firestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from '@angular/fire/firestore';
import { onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail, updatePassword } from '@angular/fire/auth';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.page.html',
  styleUrls: ['./conta.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, CommonModule, FormsModule]
})
export class ContaPage implements OnInit, OnDestroy {
  abaAtiva: 'entrar' | 'criar' | 'perfil' | 'email' | 'senha' = 'entrar';

  emailLogin = '';
  senhaLogin = '';
  emailCriar = '';
  senhaCriar = '';
  confirmarSenhaCriar = '';

  mostrarSenha = false;
  mostrarConfirmarSenha = false;

  mostrarSenhaAtual = false;
  mostrarSenhaNova = false;
  mostrarConfirmarSenhaNova = false;

  erroEmail = '';
  erroSenha = '';
  erroConfirmar = '';
  mostrarPopupSucesso = false;

  nomeUsuario = '';
  carregandoDados = false;

  emailAtual = '';
  senhaAtualEmail = '';
  emailNovo = '';

  senhaAtual = '';
  senhaNova = '';
  confirmarSenhaNova = '';

  private authSubscription!: any;

  constructor(
    private navCtrl: NavController,
    private auth: AuthService,
    private firestore: Firestore,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'person-outline': personOutline,
      'mail-outline': mailOutline,
      'key-outline': keyOutline,
      'eye-outline': eyeOutline,
      'eye-off-outline': eyeOffOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'log-out-outline': logOutOutline
    });
  }

  ngOnInit() {
    const authInstance = (this.auth as any).auth;
    if (authInstance) {
      this.authSubscription = onAuthStateChanged(authInstance, (user) => {
        if (user) {
          this.abaAtiva = 'perfil';
          this.carregarPerfilDoUsuario(user.uid);
        } else {
          this.nomeUsuario = '';
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription();
    }
  }

  get emailDoUsuario(): string {
    const user = (this.auth as any).auth?.currentUser;
    return user ? user.email : '';
  }

  async carregarPerfilDoUsuario(uid: string) {
    this.carregandoDados = true;
    try {
      const docRef = doc(this.firestore, `usuarios/${uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.nomeUsuario = docSnap.data()['nome'] || '';
      } else {
        const novoNome = await this.gerarNomeGuestUnico();

        await setDoc(docRef, {
          nome: novoNome,
          criadoEm: new Date()
        });
        this.nomeUsuario = novoNome;
      }
    } catch (e) {
      console.error('Erro ao carregar perfil do Firestore:', e);
    } finally {
      this.carregandoDados = false;
    }
  }

  async gerarNomeGuestUnico(): Promise<string> {
    const usuariosRef = collection(this.firestore, 'usuarios');
    let nomeGerado = '';
    let nomeJaExiste = true;

    while (nomeJaExiste) {
      const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
      nomeGerado = `Guest${numeroAleatorio}`;

      const q = query(usuariosRef, where('nome', '==', nomeGerado));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        nomeJaExiste = false;
      }
    }
    return nomeGerado;
  }

  async salvarNome() {
    const user = (this.auth as any).auth?.currentUser;
    if (!user || !this.nomeUsuario.trim()) return;
    const loading = await this.loadingCtrl.create({ message: 'Salvando...' });
    await loading.present();

    try {
      const usuariosRef = collection(this.firestore, 'usuarios');
      const q = query(usuariosRef, where('nome', '==', this.nomeUsuario.trim()), where('__name__', '!=', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Nome em uso',
          message: 'Este sufixo numérico já está sendo utilizado por outro usuário. Tente outro.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      const docRef = doc(this.firestore, `usuarios/${user.uid}`);
      await updateDoc(docRef, { nome: this.nomeUsuario.trim() });

      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Sucesso',
        message: 'Nome de exibição atualizado com sucesso!',
        buttons: ['OK']
      });
      await alert.present();

    } catch (e) {
      await loading.dismiss();
      console.error(e);
    }
  }

  async salvarNovoEmail() {
    return;
  }

  async salvarNovaSenha() {
    const atual = this.senhaAtual?.trim();
    const nova = this.senhaNova?.trim();
    const confirmar = this.confirmarSenhaNova?.trim();

    if (!atual || !nova || !confirmar) {
      this.exibirAlerta('Campos Vazios', 'Por favor, preencha todos os campos de senha.');
      return;
    }

    if (nova !== confirmar) {
      this.exibirAlerta('Erro de Confirmação', 'A nova senha e a confirmação não são iguais.');
      return;
    }

    if (nova.length < 6) {
      this.exibirAlerta('Senha muito curta', 'A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Atualizando sua senha...' });
    await loading.present();

    try {
      const authInstance = (this.auth as any).auth;
      const user = authInstance?.currentUser;

      if (!user) {
        throw new Error('Usuário não localizado na sessão.');
      }

      const credential = EmailAuthProvider.credential(user.email!, atual);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, nova);

      await loading.dismiss();

      this.senhaAtual = '';
      this.senhaNova = '';
      this.confirmarSenhaNova = '';

      this.mostrarSenhaAtual = false;
      this.mostrarSenhaNova = false;
      this.mostrarConfirmarSenhaNova = false;

      this.exibirAlerta('Sucesso', 'Sua senha foi updated com sucesso!');
      this.abaAtiva = 'perfil';

    } catch (error: any) {
      await loading.dismiss();
      console.error('Erro detalhado ao mudar senha:', error);

      let messageErro = 'Não foi possível atualizar a senha. Tente novamente mais tarde.';

      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        messageErro = 'A senha atual informada está incorreta.';
      } else if (error.code === 'auth/requires-recent-login') {
        messageErro = 'Sua sessão expirou por segurança. Saia do app e faça login novamente.';
      }

      this.exibirAlerta('Falha na Operação', messageErro);
    }
  }

  async exibirAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  async confirmarDesconectar() {
    const alert = await this.alertCtrl.create({
      header: 'Desconectar',
      message: 'Tem certeza que deseja sair da sua conta?',
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => { this.sair(); }
        }
      ]
    });
    await alert.present();
  }

  async confirmarDeletarConta() {
    const alert = await this.alertCtrl.create({
      header: 'Deletar Conta',
      message: 'ATENÇÃO: Essa ação é permanente e apagará todos os seus dados. Deseja prosseguir?',
      cssClass: 'custom-alert-danger',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Deletar',
          handler: () => { this.excluirContaDefinitivo(); }
        }
      ]
    });
    await alert.present();
  }

  async sair() {
    try {
      await this.auth.logout();
      this.limparErros();
      this.emailLogin = '';
      this.senhaLogin = '';
      this.nomeUsuario = '';
      this.abaAtiva = 'entrar';
    } catch (erro) {
      console.error('Erro ao sair:', erro);
    }
  }

  async excluirContaDefinitivo() {
    const user = (this.auth as any).auth?.currentUser;
    if (!user) return;

    const loading = await this.loadingCtrl.create({ message: 'Excluindo sua conta...' });
    await loading.present();

    try {
      const docRef = doc(this.firestore, `usuarios/${user.uid}`);
      await deleteDoc(docRef);

      await user.delete();

      await loading.dismiss();
      this.sair();
    } catch (erro: any) {
      await loading.dismiss();
      console.error(erro);

      if (erro.code === 'auth/requires-recent-login') {
        const alert = await this.alertCtrl.create({
          header: 'Ação Requerida',
          message: 'Por segurança, faça login novamente no aplicativo antes de excluir sua conta.',
          buttons: ['OK']
        });
        await alert.present();
        this.sair();
      }
    }
  }

  voltar() {
    this.navCtrl.navigateBack('/configuracoes', { animated: false });
  }

  trocarAba(aba: 'entrar' | 'criar') {
    this.abaAtiva = aba;
    this.limparErros();
  }

  trocarAbaSub(aba: 'perfil' | 'email' | 'senha') {
    this.abaAtiva = aba;
  }

  limparErros() {
    this.erroEmail = '';
    this.erroSenha = '';
    this.erroConfirmar = '';
  }

  alternarVisibilidadeSenha(tipo: string) {
    if (tipo === 'senha') {
      this.mostrarSenha = !this.mostrarSenha;
    } else if (tipo === 'confirmar') {
      this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
    } else if (tipo === 'senhaAtual') {
      this.mostrarSenhaAtual = !this.mostrarSenhaAtual;
    } else if (tipo === 'senhaNova') {
      this.mostrarSenhaNova = !this.mostrarSenhaNova;
    } else if (tipo === 'confirmarSenhaNova') {
      this.mostrarConfirmarSenhaNova = !this.mostrarConfirmarSenhaNova;
    }
  }

  async entrar() {
    this.limparErros();
    if (!this.emailLogin) { this.erroEmail = 'Email incorreto'; return; }
    if (!this.senhaLogin) { this.erroSenha = 'Senha incorreta'; return; }
    try {
      await this.auth.login(this.emailLogin, this.senhaLogin);
    } catch (erro: any) {
      this.erroEmail = 'Email incorreto';
      this.erroSenha = 'Senha incorreta';
    }
  }

  async criarConta() {
    this.limparErros();
    if (!this.emailCriar || !this.emailCriar.includes('@')) { this.erroEmail = 'Formato de email inválido'; return; }
    if (!this.senhaCriar || this.senhaCriar.length < 6) { this.erroSenha = 'A senha deve ter pelo menos 6 caracteres'; return; }
    if (this.senhaCriar !== this.confirmarSenhaCriar) { this.erroConfirmar = 'As senhas não coincidem'; return; }

    try {
      await this.auth.cadastrar(this.emailCriar, this.senhaCriar);
      await this.auth.logout();
      this.mostrarPopupSucesso = true;
    } catch (erro: any) {
      this.erroEmail = 'Erro ao cadastrar ou e-mail já em uso.';
    }
  }

  irParaEntrar() {
    this.mostrarPopupSucesso = false;
    this.abaAtiva = 'entrar';
    this.emailLogin = this.emailCriar;
  }
}
