import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { arrowBackOutline, trashBinOutline, documentTextOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { DebugService, DebugLog } from '../core/debug.service';

@Component({
  selector: 'app-debug-logs',
  templateUrl: './debug-logs.page.html',
  styleUrls: ['./debug-logs.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class DebugLogsPage implements OnInit {
  private router = inject(Router);
  private debug = inject(DebugService);

  logs: DebugLog[] = [];
  stats: any = {};

  // Icons
  arrowBackOutline = arrowBackOutline;
  trashBinOutline = trashBinOutline;
  documentTextOutline = documentTextOutline;

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    this.logs = this.debug.getLogs();
    this.stats = this.debug.getStats();
  }

  clearLogs() {
    if (confirm('Tem certeza que deseja apagar todos os logs?')) {
      this.debug.clearLogs();
      this.logs = [];
      this.stats = {};
    }
  }

  exportLogs() {
    const json = this.debug.exportLogs();
    // Copy to clipboard
    navigator.clipboard.writeText(json).then(() => {
      alert('Logs copiados para clipboard!');
    }).catch(() => {
      alert('Erro ao copiar. JSON:\n\n' + json);
    });
  }

  goBack() {
    this.router.navigate(['/configuracoes']);
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'info':
        return 'primary';
      case 'warn':
        return 'warning';
      case 'error':
        return 'danger';
      case 'success':
        return 'success';
      default:
        return 'medium';
    }
  }

  getLevelIcon(level: string): string {
    switch (level) {
      case 'info':
        return 'ℹ️';
      case 'warn':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      default:
        return '•';
    }
  }
}

