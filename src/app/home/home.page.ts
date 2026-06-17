import { ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonCard, IonButton, IonIcon, IonFooter,
  IonTabBar, IonTabButton, IonFab, IonFabButton, IonPopover,
  IonList, IonItem, IonLabel, IonToggle
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  optionsOutline, moonOutline, alarm, settingsOutline,
  add, personCircleOutline, trashOutline, createOutline
} from 'ionicons/icons';

import { AuthService } from '../services/auth.service';
import { AlarmService, Alarm } from '../core/alarm.service';
import { NotificationService } from '../core/notification.service';

import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule, IonContent, IonCard, IonButton, IonIcon,
    IonFooter, IonTabBar, IonTabButton, IonFab, IonFabButton,
    IonPopover, IonList, IonItem, IonLabel, IonToggle, RouterModule
  ],
})
export class HomePage implements OnInit, OnDestroy, ViewWillEnter {

  private alarmService = inject(AlarmService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  isLoggedIn$: Observable<boolean>;

  alarmes: Alarm[] = [];
  ordemSelecionada = 'crescente';

  private unsubscribeFirebase?: () => void;
  private authSub?: Subscription;

  private checkInterval?: any;
  private logado = false;

  constructor(
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      optionsOutline,
      moonOutline,
      alarm,
      settingsOutline,
      add,
      personCircleOutline,
      trashOutline,
      createOutline
    });

    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  ngOnInit() {

    this.authSub = this.isLoggedIn$.subscribe(logado => {
      this.logado = logado;

      if (this.unsubscribeFirebase) {
        this.unsubscribeFirebase();
        this.unsubscribeFirebase = undefined;
      }

      if (logado) {
        this.unsubscribeFirebase = this.alarmService.escutarAlarmesFirebase(alarmes => {
          this.alarmes = this.ordenar(alarmes);
          this.cdr.detectChanges();
        });

      } else {
        this.alarmes = this.ordenar(this.alarmService.getAlarmesLocais());
        this.cdr.detectChanges();
      }
    });

    // checagem de horário
    this.checkInterval = setInterval(() => {

      const agora = new Date();
      const horaAtual =
        `${agora.getHours().toString().padStart(2, '0')}:` +
        `${agora.getMinutes().toString().padStart(2, '0')}`;

      const alarme = this.alarmes.find(a => a.hora === horaAtual && a.ativo);

      if (alarme) {
        clearInterval(this.checkInterval);
        this.router.navigate(['/alarm']);
      }

    }, 1000);
  }

  ionViewWillEnter() {
    this.alarmes = this.ordenar(this.alarmService.getAlarmesLocais());
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    if (this.unsubscribeFirebase) this.unsubscribeFirebase();
    if (this.authSub) this.authSub.unsubscribe();

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  // ───────────────────────────────
  // ORDEM
  // ───────────────────────────────

  get textoOrdem(): string {
    return this.ordemSelecionada === 'decrescente'
      ? 'Horário decrescente'
      : 'Horário crescente';
  }

  private paraMinutos(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  ordenar(alarmes: Alarm[]): Alarm[] {
    return [...alarmes].sort((a, b) => {
      const diff = this.paraMinutos(a.hora) - this.paraMinutos(b.hora);
      return this.ordemSelecionada === 'decrescente' ? -diff : diff;
    });
  }

  selecionarOrdem(tipo: string) {
    this.ordemSelecionada = tipo;
    this.alarmes = this.ordenar(this.alarmes);
  }

  // ───────────────────────────────
  // AÇÕES
  // ───────────────────────────────

  async alternarAtivo(alarme: Alarm) {
    const novoEstado = !alarme.ativo;
    alarme.ativo = novoEstado;

    if (alarme.id) {
      await this.alarmService.atualizar(alarme.id, { ativo: novoEstado });

      if (novoEstado) {
        await this.notificationService.agendarAlarme(alarme);
      } else {
        await this.notificationService.cancelarAlarme(alarme);
      }
    }
  }

  async deletarAlarme(alarme: Alarm) {
    if (alarme.id) {
      await this.notificationService.cancelarAlarme(alarme);
      await this.alarmService.deletar(alarme.id);

      this.alarmes = this.alarmes.filter(a => a.id !== alarme.id);
      this.cdr.detectChanges();
    }
  }

  novoAlarme() {
    this.router.navigate(['/pag2']);
  }

  editarAlarme(alarme: Alarm) {
    if (!alarme?.id) return;

    this.router.navigate(['/pag2'], {
      queryParams: { alarmeId: alarme.id }
    });
  }

  diasFormatados(dias: string[]): string {
    if (!dias || dias.length === 0) return 'Uma vez';
    if (dias.length === 7) return 'Todos os dias';

    const nomes: Record<string, string> = {
      dom: 'Dom', seg: 'Seg', ter: 'Ter',
      qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb'
    };

    return dias.map(d => nomes[d] || d).join(', ');
  }
}
