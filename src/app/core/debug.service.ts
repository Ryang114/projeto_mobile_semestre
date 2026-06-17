import { Injectable } from '@angular/core';

export interface DebugLog {
  timestamp: string;
  source: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class DebugService {
  private readonly STORAGE_KEY = 'alarm_debug_logs';
  private readonly MAX_LOGS = 100;
  private logs: DebugLog[] = [];

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      this.logs = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Erro ao carregar logs:', e);
      this.logs = [];
    }
  }

  private saveLogs() {
    try {
      // Manter apenas os últimos MAX_LOGS
      const recentLogs = this.logs.slice(-this.MAX_LOGS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentLogs));
    } catch (e) {
      console.error('Erro ao salvar logs:', e);
    }
  }

  log(source: string, message: string, data?: any) {
    const entry: DebugLog = {
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      source,
      level: 'info',
      message,
      data
    };
    this.logs.push(entry);
    this.saveLogs();
    console.log(`[${source}] ${message}`, data || '');
  }

  warn(source: string, message: string, data?: any) {
    const entry: DebugLog = {
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      source,
      level: 'warn',
      message,
      data
    };
    this.logs.push(entry);
    this.saveLogs();
    console.warn(`[${source}] ${message}`, data || '');
  }

  error(source: string, message: string, data?: any) {
    const entry: DebugLog = {
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      source,
      level: 'error',
      message,
      data
    };
    this.logs.push(entry);
    this.saveLogs();
    console.error(`[${source}] ${message}`, data || '');
  }

  success(source: string, message: string, data?: any) {
    const entry: DebugLog = {
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      source,
      level: 'success',
      message,
      data
    };
    this.logs.push(entry);
    this.saveLogs();
    console.log(`[${source}] ✅ ${message}`, data || '');
  }

  getLogs(): DebugLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  getStats() {
    return {
      total: this.logs.length,
      info: this.logs.filter(l => l.level === 'info').length,
      warn: this.logs.filter(l => l.level === 'warn').length,
      error: this.logs.filter(l => l.level === 'error').length,
      success: this.logs.filter(l => l.level === 'success').length,
      sources: [...new Set(this.logs.map(l => l.source))]
    };
  }
}

