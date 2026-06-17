import { Injectable } from '@angular/core';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Alarm } from './alarm.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  async solicitarPermissao(): Promise<boolean> {
    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  }

  async agendarAlarme(alarme: Alarm): Promise<void> {
    const permitido = await this.solicitarPermissao();
    if (!permitido) return;

    // Cancela notificações anteriores desse alarme
    await this.cancelarAlarme(alarme);

    const [hora, minuto] = alarme.hora.split(':').map(Number);
    const diasSemana = this.converterDias(alarme.dias);

    const notificacoes: ScheduleOptions['notifications'] = [];

    const soundForNotification = (alarme.som && !alarme.som.startsWith('data:')) ? alarme.som : 'beep.wav';

    if (diasSemana.length === 0) {
      // Dispara uma única vez no próximo horário
      const agora = new Date();
      const alvo = new Date();
      alvo.setHours(hora, minuto, 0, 0);
      if (alvo <= agora) alvo.setDate(alvo.getDate() + 1);

        notificacoes.push({
        id: this.gerarId(alarme.id!, 0),
        title: alarme.nome,
        body: `Alarme: ${alarme.hora}`,
        schedule: { at: alvo, allowWhileIdle: true },
          sound: soundForNotification,
        channelId: 'alarm-channel',
        ongoing: true,
        autoCancel: false,
        extra: { alarmeId: alarme.id }
      });

    } else {
      // Agenda para cada dia da semana selecionado
        for (const dia of diasSemana) {
        notificacoes.push({
          id: this.gerarId(alarme.id!, dia),
          title: alarme.nome,
          body: `Alarme: ${alarme.hora}`,
          schedule: {
            on: { weekday: dia, hour: hora, minute: minuto },
            allowWhileIdle: true
          },
            sound: soundForNotification,
          channelId: 'alarm-channel',
          ongoing: true,
          autoCancel: false,
          extra: { alarmeId: alarme.id }
        });
      }
    }

    await LocalNotifications.schedule({ notifications: notificacoes });
  }

  async cancelarAlarme(alarme: Alarm): Promise<void> {
    const dias = this.converterDias(alarme.dias);
    const ids = dias.length === 0
      ? [{ id: this.gerarId(alarme.id!, 0) }]
      : dias.map(d => ({ id: this.gerarId(alarme.id!, d) }));

    await LocalNotifications.cancel({ notifications: ids });
  }

  // Gera ID numérico único por alarme + dia
  private gerarId(alarmeId: string, dia: number): number {
    let hash = 0;
    for (const c of alarmeId) hash = (hash * 31 + c.charCodeAt(0)) & 0xfffffff;
    return (hash * 10 + dia) & 0x7fffffff;
  }

  // Converte chaves (dom, seg...) para número do dia (1=Dom, 2=Seg...)
  private converterDias(dias: string[]): number[] {
    const mapa: Record<string, number> = {
      dom: 1, seg: 2, ter: 3, qua: 4, qui: 5, sex: 6, sab: 7
    };
    return (dias || []).map(d => mapa[d]).filter(Boolean);
  }
}
