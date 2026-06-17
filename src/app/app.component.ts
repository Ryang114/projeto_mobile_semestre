import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { DebugService } from './core/debug.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private debug = inject(DebugService);
  private actionHandle: any;
  private receiveHandle: any;

  constructor() {
    this.debug.log('AppComponent', 'Construtor chamado');
  }

  ngOnInit() {
    this.debug.log('AppComponent', 'ngOnInit - Iniciando notificações');
    this.initNotifications();
    // Also check for notification that opened the app on startup (cold start)
    this.checkNotificationOnStart();
  }

  ngOnDestroy() {
    this.debug.log('AppComponent', 'ngOnDestroy - Limpando listeners');
    try {
      this.actionHandle?.remove?.();
      this.receiveHandle?.remove?.();
    } catch (e) {
      // ignore
    }
  }

  private async checkNotificationOnStart() {
    try {
      this.debug.log('AppComponent', 'Verificando notificações entregues no startup...');
      // Get notifications that opened the app when it was not running
      const notif = await LocalNotifications.getDeliveredNotifications();
      this.debug.log('AppComponent', 'Notificações entregues ao iniciar', { count: notif.notifications.length, notifs: notif.notifications });

      // If there's an alarm notification, navigate to it
      if (notif.notifications && notif.notifications.length > 0) {
        const alarmNotif = notif.notifications.find(n => n.extra?.alarmeId);
        if (alarmNotif) {
          this.debug.success('AppComponent', 'Alarme encontrado ao iniciar! Navegando para alarm page', { alarmeId: alarmNotif.extra.alarmeId });
          this.router.navigate(['/alarm'], { queryParams: { alarmeId: alarmNotif.extra.alarmeId } });
        } else {
          this.debug.warn('AppComponent', 'Notificações entregues mas nenhuma com alarmeId');
        }
      } else {
        this.debug.log('AppComponent', 'Nenhuma notificação entregue no startup');
      }
    } catch (e) {
      this.debug.error('AppComponent', 'Erro ao verificar notificações no startup', e);
    }
  }

  private async initNotifications() {
    try {
      this.debug.log('AppComponent', 'Solicitando permissão de notificações...');
      const { display } = await LocalNotifications.requestPermissions();
      this.debug.log('AppComponent', `Permissão recebida: ${display}`);

      if (display !== 'granted') {
        this.debug.warn('AppComponent', 'Permissão de notificação não concedida');
        return;
      }

      // On Android 8+ notifications play sounds configured on the NotificationChannel.
      // Create a dedicated channel for alarms with the custom sound (beep.wav) so the
      // scheduled notifications actually play the audio when fired.
      try {
        if (Capacitor.getPlatform() === 'android') {
          this.debug.log('AppComponent', 'Plataforma Android detectada. Criando canal...');
          await LocalNotifications.createChannel({
            id: 'alarm-channel',
            name: 'Alarmes',
            description: 'Canal para alarmes do app',
            importance: 5, // máxima prioridade para tocar som
            vibration: true,
            sound: 'beep.wav'
          });
          this.debug.success('AppComponent', 'Canal de alarmes criado com sucesso');
        } else {
          this.debug.log('AppComponent', `Plataforma detectada: ${Capacitor.getPlatform()} (não é Android, pulando criação de canal)`);
        }
      } catch (e) {
        this.debug.warn('AppComponent', 'Erro criando channel de notificações (pode ser ignorado em web)', e);
      }

      // When the user taps the notification we want to open a dedicated Alarm page
      // that will play the alarm sound in loop and present dismiss/snooze controls.
      this.actionHandle = LocalNotifications.addListener('localNotificationActionPerformed', (event: any) => {
        this.debug.log('AppComponent', 'Listener: Notificação acionada pelo usuário', event);
        const alarmeId = event?.notification?.extra?.alarmeId;
        if (alarmeId) {
          this.debug.success('AppComponent', 'Navegando para /alarm com alarmeId', { alarmeId });
          this.router.navigate(['/alarm'], { queryParams: { alarmeId } });
        } else {
          this.debug.log('AppComponent', 'Navegando para /alarm sem alarmeId');
          this.router.navigate(['/alarm']);
        }
      });

      this.receiveHandle = LocalNotifications.addListener('localNotificationReceived', (event: any) => {
        this.debug.log('AppComponent', 'Listener: Notificação recebida (app em foreground)', {
          title: event?.notification?.title,
          alarmeId: event?.notification?.extra?.alarmeId
        });
      });

      this.debug.success('AppComponent', 'Listeners registrados com sucesso');
    } catch (err) {
      this.debug.error('AppComponent', 'Erro inicializando notificações locais', err);
    }
  }
}
