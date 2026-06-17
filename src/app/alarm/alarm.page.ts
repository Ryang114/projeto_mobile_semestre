import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonFooter, IonTabBar, IonTabButton } from '@ionic/angular/standalone';
import { stopOutline, alarmOutline, closeOutline } from 'ionicons/icons';
import { AlarmService, Alarm } from '../core/alarm.service';
import { DebugService } from '../core/debug.service';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.page.html',
  styleUrls: ['./alarm.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonFooter, IonTabBar, IonTabButton]
})
export class AlarmPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alarmService = inject(AlarmService);
  private debug = inject(DebugService);

  audio?: HTMLAudioElement;
  alarme?: Alarm | null;
  alarmeId?: string | null;
  playing = false;
  // expose icons to template
  public stopOutline = stopOutline;
  public alarmOutline = alarmOutline;
  public closeOutline = closeOutline;

  constructor() {
    this.debug.log('AlarmPage', 'Construtor chamado');
  }

  ngOnInit(): void {
    this.debug.success('AlarmPage', 'ngOnInit - Página de alarme inicializada');
    this.route.queryParamMap.subscribe(async params => {
      this.alarmeId = params.get('alarmeId');
      this.debug.log('AlarmPage', 'queryParamMap atualizado', { alarmeId: this.alarmeId });

      if (this.alarmeId) {
        const alarmes = this.alarmService.getAlarmesLocais();
        this.alarme = alarmes.find(a => a.id === this.alarmeId) ?? null;
        this.debug.log('AlarmPage', 'Alarme encontrado no serviço', {
          found: !!this.alarme,
          nome: this.alarme?.nome,
          hora: this.alarme?.hora
        });
      }

      // Pequeno delay para garantir que a página está pronta antes de tocar
      await new Promise(resolve => setTimeout(resolve, 300));

      // Start playing the alarm sound in loop. Use multiple path attempts
      // because the asset path can vary depending on dev vs. production
      await this.iniciarSom();
    });
  }

  ngOnDestroy(): void {
    this.debug.log('AlarmPage', 'ngOnDestroy - Página destruída, pausando áudio');
    this.audio?.pause();
    this.audio = undefined;
  }

  private async iniciarSom(): Promise<void> {
    this.debug.log('AlarmPage', 'Tendando iniciar som do alarme');

    // Build possible audio paths. Prefer the sound selected on the alarm (this.alarme?.som).
    let caminhosPossiveis: string[] = [];
    const selecionado = this.alarme?.som;
    if (selecionado) {
      if (String(selecionado).startsWith('data:')) {
        // data URL stored from file picker — play directly
        caminhosPossiveis = [String(selecionado)];
      } else {
        // assume filename from assets
        caminhosPossiveis = [
          `./assets/sounds/${selecionado}`,
          `/assets/sounds/${selecionado}`,
          `assets/sounds/${selecionado}`,
          `/${selecionado}`
        ];
      }
    }

    // Fallbacks (keep previous attempts)
    caminhosPossiveis = caminhosPossiveis.concat([
      './assets/sounds/beep.wav',
      '/assets/sounds/beep.wav',
      'assets/sounds/beep.wav',
      '/beep.wav'
    ]);

    for (const caminho of caminhosPossiveis) {
      try {
        this.debug.log('AlarmPage', `Tentando carregar áudio de: ${caminho}`);
        this.audio = new Audio(caminho);
        this.audio.crossOrigin = 'anonymous';
        this.audio.loop = true;
        this.audio.volume = 1.0;

        // Tentar tocar
        const playPromise = this.audio.play();
        if (playPromise) {
          await playPromise;
          this.debug.success('AlarmPage', `Som tocando com sucesso de: ${caminho}`);
          this.playing = true;
          return; // Sucesso!
        }
      } catch (e) {
        this.debug.warn('AlarmPage', `Falha ao carregar/tocar de ${caminho}`, e);
      }
    }

    // Se chegou aqui, nenhum caminho funcionou
    this.debug.error('AlarmPage', 'Não foi possível carregar áudio de nenhum caminho. Usuário precisará clicar no botão Tocar.');
    this.playing = false;
  }

  async tocar() {
    this.debug.log('AlarmPage', 'Botão Tocar clicado');

    if (!this.audio) {
      this.debug.log('AlarmPage', 'Audio não existe, criando novo');
      // Tenta os caminhos novamente
      const caminhosPossiveis = [
        './assets/sounds/beep.wav',
        '/assets/sounds/beep.wav',
        'assets/sounds/beep.wav',
        '/beep.wav'
      ];

      for (const caminho of caminhosPossiveis) {
        try {
          this.debug.log('AlarmPage', `Tentando carregar áudio de: ${caminho}`);
          this.audio = new Audio(caminho);
          this.audio.crossOrigin = 'anonymous';
          this.audio.loop = true;
          this.audio.volume = 1.0;
          this.debug.success('AlarmPage', `Elemento de áudio criado com sucesso: ${caminho}`);
          break;
        } catch (e) {
          this.debug.warn('AlarmPage', `Erro ao criar audio com ${caminho}`, e);
        }
      }
    }

    if (!this.audio) {
      this.debug.error('AlarmPage', 'Não foi possível criar elemento de áudio');
      return;
    }

    try {
      const playPromise = this.audio.play();
      if (playPromise) {
        await playPromise;
      }
      this.playing = true;
      this.debug.success('AlarmPage', 'Som iniciado com sucesso');
    } catch (e) {
      this.debug.error('AlarmPage', 'Erro ao tocar som', e);
    }
  }

  fecharSemSalvar() {
    this.debug.log('AlarmPage', 'Botão fechar clicado');
    try {
      this.audio?.pause();
      this.audio = undefined;
    } catch (e) {
      this.debug.warn('AlarmPage', 'Erro ao pausar', e);
    }
    this.playing = false;
    this.debug.log('AlarmPage', 'Navegando para /home sem salvar alterações');
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  voltarParaHome() {
    this.fecharSemSalvar();
  }

  parar() {
    this.debug.log('AlarmPage', 'Botão Parar clicado');
    this.voltarParaHome();
  }

  // Snooze for 5 minutes
  async soneca(minutos = 5) {
    this.debug.log('AlarmPage', 'Soneca acionada', { minutos });

    // stop current sound
    this.parar();

    // No longer schedule snooze via LocalNotifications in this version
    // Instead, just go back to home and let the user set a new alert if needed
    this.router.navigate(['/home']);
  }

  // Helper to reproduce gerarId used in NotificationService
  private hashId(alarmeId: string, dia: number) {
    let hash = 0;
    for (const c of alarmeId) hash = (hash * 31 + c.charCodeAt(0)) & 0xfffffff;
    return String((hash * 10 + dia) & 0x7fffffff);
  }
}

