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
import { AuthService } from '../services/auth.service';
import { AlarmService, Alarm } from '../core/alarm.service';
import { NotificationService } from '../core/notification.service';
import { Observable, Subscription } from 'rxjs';
import {
  optionsOutline, moonOutline, alarm, settingsOutline,
  add, personCircleOutline, trashOutline, createOutline
} from 'ionicons/icons';

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

  constructor(private auth: AuthService) {
    addIcons({
      'options-outline': optionsOutline,
      'moon-outline': moonOutline,
      'alarm': alarm,
      'settings-outline': settingsOutline,
      'add': add,
      'person-circle-outline': personCircleOutline,
      'trash-outline': trashOutline,
      'create-outline': createOutline
    });
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  ngOnInit() {
    this.authSub = this.isLoggedIn$.subscribe(logado => {
      if (this.unsubscribeFirebase) {
        this.unsubscribeFirebase();
        this.unsubscribeFirebase = undefined;
      }

      if (logado) {
        this.unsubscribeFirebase = this.alarmService.escutarAlarmesFirebase(alarmes => {
          this.alarmes = this.ordenar(alarmes);
        });
      } else {
        this.alarmes = this.ordenar(this.alarmService.getAlarmesLocais());
      }
    });
  }

    ionViewWillEnter() {
    this.alarmes = this.ordenar(this.alarmService.getAlarmesLocais());
  }

  ngOnDestroy() {
    if (this.unsubscribeFirebase) this.unsubscribeFirebase();
    if (this.authSub) this.authSub.unsubscribe();
  }

  get textoOrdem(): string {
    return this.ordemSelecionada === 'decrescente' ? 'Horário decrescente' : 'Horário crescente';
  }

  private paraMinutos(hora: string): number {
    const [horas, minutos] = hora.split(':').map(valor => Number(valor));
    return (Number.isNaN(horas) ? 0 : horas) * 60 + (Number.isNaN(minutos) ? 0 : minutos);
  }

  ordenar(alarmes: Alarm[]): Alarm[] {
    return [...alarmes].sort((a, b) => {
      const diferenca = this.paraMinutos(a.hora) - this.paraMinutos(b.hora);
      return this.ordemSelecionada === 'decrescente' ? -diferenca : diferenca;
    });
  }

  selecionarOrdem(tipo: string) {
    this.ordemSelecionada = tipo;
    this.alarmes = this.ordenar(this.alarmes);
  }

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
    }
  }

  novoAlarme() {
    this.router.navigate(['/pag2']);
  }

  editarAlarme(alarme: Alarm) {
    if (!alarme || !alarme.id) return;
    this.router.navigate(['/pag2'], { queryParams: { alarmeId: alarme.id } });
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
