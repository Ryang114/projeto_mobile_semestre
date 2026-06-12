import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private actionHandle: any;
  private receiveHandle: any;

  constructor() {}

  ngOnInit() {
    this.initNotifications();
  }

  ngOnDestroy() {
    try {
      this.actionHandle?.remove?.();
      this.receiveHandle?.remove?.();
    } catch (e) {
      // ignore
    }
  }

  private async initNotifications() {
    try {
      const { display } = await LocalNotifications.requestPermissions();
      if (display !== 'granted') return;

      this.actionHandle = LocalNotifications.addListener('localNotificationActionPerformed', (event: any) => {
        const alarmeId = event?.notification?.extra?.alarmeId;
        if (alarmeId) {
          this.router.navigate(['/home'], { queryParams: { alarmeId } });
        } else {
          this.router.navigate(['/home']);
        }
      });

      this.receiveHandle = LocalNotifications.addListener('localNotificationReceived', (event: any) => {
        console.log('Notificação recebida', event);
      });
    } catch (err) {
      console.error('Erro inicializando notificações locais', err);
    }
  }
}
