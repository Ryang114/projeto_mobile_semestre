import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonButtons,
  IonButton, IonIcon, IonDatetime, IonText,
  IonItem, IonInput, IonLabel,
  ToastController, LoadingController
} from '@ionic/angular/standalone';
import { IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeOutline, imageOutline, saveOutline } from 'ionicons/icons';
import { AlarmService } from '../core/alarm.service';
import { NotificationService } from '../core/notification.service';
import { PACKAGED_SOUNDS } from '../core/sounds';

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
    CommonModule, FormsModule, IonContent, IonHeader, IonToolbar,
    IonButtons, IonButton, IonIcon,
    IonDatetime, IonText, IonItem, IonInput, IonLabel, IonSelect, IonSelectOption
  ]
})
export class Pag2Page implements OnInit {

  private alarmService = inject(AlarmService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private route = inject(ActivatedRoute);

  horaEscolhida: string = new Date().toISOString();
  nomeAlarme: string = '';
  public sounds = PACKAGED_SOUNDS.map(s => ({ label: s.name, value: s.file }));
  public selectedSound: string = 'beep.wav';
  public selectedSoundName: string = 'Padrão (beep)';

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

  // ✅ NOVO: fecha a página e volta para home
  fechar() {
    this.router.navigate(['/home']);
  }

  onSoundChange(ev: any) {
    const val = ev.detail ? ev.detail.value : ev;
    if (val === 'file') {
      const inp = document.getElementById('filePicker') as HTMLInputElement | null;
      if (inp) inp.click();
      return;
    }
    this.selectedSoundName = this.sounds.find(s => s.value === val)?.label || val;
    this.selectedSound = val;
  }

  async onFilePicked(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.selectedSoundName = file.name;
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.selectedSound = result;
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error('Erro lendo arquivo de som', e);
    }
  }

  editing = false;
  editingId?: string | null;
  private originalAlarm: any;

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const alarmeId = params.get('alarmeId');
      if (alarmeId) {
        this.editing = true;
        this.editingId = alarmeId;
        const alarmes = this.alarmService.getAlarmesLocais();
        const found = alarmes.find(a => String(a.id) === String(alarmeId));
        if (found) {
          this.originalAlarm = found;
          this.nomeAlarme = found.nome || '';
          this.selectedSound = found.som || 'beep.wav';
          this.selectedSoundName = (found.som && found.som.toString().startsWith('data:')) ? (found.nome || 'Arquivo de som') : (found.som || 'Padrão (beep)');
          const diasSet = new Set(found.dias || []);
          this.dias.forEach(d => d.ativo = diasSet.has(d.chave));
          try {
            const [hh, mm] = (found.hora || '00:00').split(':').map(Number);
            const now = new Date();
            now.setHours(hh, mm, 0, 0);
            this.horaEscolhida = now.toISOString();
          } catch (e) { }
        }
      }
    });
  }

  alternarDia(dia: DiaSemana) {
    dia.ativo = !dia.ativo;
  }

  async salvar() {
    const loading = await this.loadingCtrl.create({ message: 'Salvando...' });
    await loading.present();

    try {
      const diasAtivos = this.dias.filter(d => d.ativo).map(d => d.chave);
      const hora = new Date(this.horaEscolhida)
        .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const alarme = {
        hora,
        nome: this.nomeAlarme || 'Alarme',
        dias: diasAtivos,
        ativo: true,
        som: this.selectedSound
      };

      if (this.editing && this.editingId) {
        await this.alarmService.atualizar(String(this.editingId), alarme);
        try {
          if (this.originalAlarm && this.originalAlarm.id) {
            await this.notificationService.cancelarAlarme(this.originalAlarm);
          }
        } catch (e) { }
        await this.notificationService.agendarAlarme({ ...alarme, id: String(this.editingId) });
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Alarme atualizado!',
          duration: 2000,
          color: 'primary',
          position: 'bottom'
        });
        await toast.present();
        this.router.navigate(['/home']);
        return;
      }

      const id = await this.alarmService.salvar(alarme);
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

  get textoDiasSelecionados(): string {
  const nomesDias: Record<string, string> = {
    dom: 'Dom',
    seg: 'Seg',
    ter: 'Ter',
    qua: 'Qua',
    qui: 'Qui',
    sex: 'Sex',
    sab: 'Sab'
  };

  const selecionados = this.dias
    .filter(d => d.ativo)
    .map(d => nomesDias[d.chave]);

  return selecionados.length > 0
    ? selecionados.join(', ')
    : 'Uma vez';
}
}
