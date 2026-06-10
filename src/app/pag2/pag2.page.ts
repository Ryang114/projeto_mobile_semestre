import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
  IonButton, IonIcon, IonDatetime, IonText,
  IonItem, IonInput, IonList, IonLabel, IonNote,
  ToastController, LoadingController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeOutline, imageOutline, saveOutline } from 'ionicons/icons';
import { AlarmService } from '../core/alarm.service';
import { NotificationService } from '../core/notification.service';

interface DiaSemana {
  nome: string;
  chave: string;
  ativo: boolean;
}

@Component({
  selector: 'app-add-alarm',
  templateUrl: './pag2.page.html',
  styleUrls: ['./pag2.page.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle,
    IonToolbar, IonButtons, IonButton, IonIcon,
    IonDatetime, IonText, IonItem, IonInput, IonList, IonLabel, IonNote
  ]
})
export class Pag2Page implements OnInit {

  private alarmService = inject(AlarmService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  horaEscolhida: string = new Date().toISOString();
  nomeAlarme: string = '';

  public dias: DiaSemana[] = [
    { nome: 'D', chave: 'dom', ativo: false },
    { nome: 'S', chave: 'seg', ativo: false },
    { nome: 'T', chave: 'ter', ativo: false },
    { nome: 'Q', chave: 'qua', ativo: false },
    { nome: 'Q', chave: 'qui', ativo: false },
    { nome: 'S', chave: 'sex', ativo: false },
    { nome: 'S', chave: 'sab', ativo: false },
  ];

  constructor() {
    addIcons({ closeOutline, imageOutline, saveOutline });
  }

  ngOnInit() {}

  alternarDia(dia: DiaSemana) {
    dia.ativo = !dia.ativo;
  }

  async salvar() {
    const loading = await this.loadingCtrl.create({ message: 'Salvando...' });
    await loading.present();

    try {
      const diasAtivos = this.dias
        .filter(d => d.ativo)
        .map(d => d.chave);

      const hora = new Date(this.horaEscolhida)
        .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const alarme = {
        hora,
        nome: this.nomeAlarme || 'Alarme',
        dias: diasAtivos,
        ativo: true
      };

      const id = await this.alarmService.salvar(alarme);

      // Agenda a notificação no dispositivo
      await this.notificationService.agendarAlarme({ ...alarme, id: String(id) });

      await loading.dismiss();

      const toast = await this.toastCtrl.create({
        message: 'Alarme salvo!',
        duration: 2000,
        color: 'primary',
        position: 'bottom'
      });
      await toast.present();

      this.router.navigate(['/home']);

    } catch (error) {
      await loading.dismiss();

      const toast = await this.toastCtrl.create({
        message: 'Erro ao salvar. Verifique sua conexão.',
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();

      console.error(error);
    }
  }
}