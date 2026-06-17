import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  Timestamp
} from '@angular/fire/firestore';

import { Auth, authState } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

export interface Alarm {
  id?: string;
  hora: string;
  nome: string;
  dias: string[];
  ativo: boolean;
  som?: string;
  criadoEm?: Timestamp;
}

const LOCAL_KEY = 'alarmes_locais';

@Injectable({ providedIn: 'root' })
export class AlarmService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private authSub?: Subscription;
  private unsubscribeAlarmes?: () => void;

  // ─────────────────────────────────────────────
  // LOCAL STORAGE
  // ─────────────────────────────────────────────

  getAlarmesLocais(): Alarm[] {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private salvarAlarmesLocais(alarmes: Alarm[]) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(alarmes));
  }

  salvarLocal(alarme: Omit<Alarm, 'id'>): string {
    const alarmes = this.getAlarmesLocais();
    const id = 'local_' + Date.now();

    alarmes.push({ ...alarme, id });
    this.salvarAlarmesLocais(alarmes);

    return id;
  }

  atualizarLocal(id: string, dados: Partial<Alarm>) {
    const alarmes = this.getAlarmesLocais().map(a =>
      a.id === id ? { ...a, ...dados } : a
    );

    this.salvarAlarmesLocais(alarmes);
  }

  deletarLocal(id: string) {
    const alarmes = this.getAlarmesLocais().filter(a => a.id !== id);
    this.salvarAlarmesLocais(alarmes);
  }

  limparAlarmesLocais() {
    localStorage.removeItem(LOCAL_KEY);
  }

  // ─────────────────────────────────────────────
  // FIREBASE CRUD
  // ─────────────────────────────────────────────

  async salvarFirebase(alarme: Omit<Alarm, 'id'>): Promise<string> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('Usuário não autenticado');

    const ref = await addDoc(collection(this.firestore, 'alarmes'), {
      ...alarme,
      uid,
      criadoEm: Timestamp.now()
    });

    return ref.id;
  }

  async atualizarFirebase(id: string, dados: Partial<Alarm>): Promise<void> {
    await updateDoc(doc(this.firestore, 'alarmes', id), dados);
  }

  async deletarFirebase(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'alarmes', id));
  }

  // ─────────────────────────────────────────────
  // LISTENER FIREBASE (CORRIGIDO)
  // ─────────────────────────────────────────────

  escutarAlarmesFirebase(callback: (alarmes: Alarm[]) => void): () => void {

    this.authSub = authState(this.auth).subscribe(user => {
      if (!user) return;

      console.log('UID pronto:', user.uid);

      // evita duplicar listener
      if (this.unsubscribeAlarmes) {
        this.unsubscribeAlarmes();
      }

      const q = query(
        collection(this.firestore, 'alarmes'),
        where('uid', '==', user.uid)
      );

      this.unsubscribeAlarmes = onSnapshot(q, (snapshot) => {

        console.log('SNAPSHOT RECEBIDO');
        console.log('Quantidade:', snapshot.size);

        const alarmes: Alarm[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<Alarm, 'id'>)
        }));

        callback(alarmes);
      });
    });

    return () => {
      this.unsubscribeAlarmes?.();
      this.authSub?.unsubscribe();
    };
  }

  // ─────────────────────────────────────────────
  // MIGRAÇÃO LOCAL → FIREBASE
  // ─────────────────────────────────────────────

  async migrarLocaisParaFirebase(): Promise<void> {
    const locais = this.getAlarmesLocais();

    for (const alarme of locais) {
      const { id, ...dados } = alarme;
      await this.salvarFirebase(dados);
    }

    this.limparAlarmesLocais();
  }

  // ─────────────────────────────────────────────
  // FUNÇÃO UNIFICADA
  // ─────────────────────────────────────────────

  salvar(alarme: Omit<Alarm, 'id'>): Promise<string> | string {
    if (this.auth.currentUser) {
      return this.salvarFirebase(alarme);
    }
    return this.salvarLocal(alarme);
  }

  async atualizar(id: string, dados: Partial<Alarm>): Promise<void> {
    if (this.auth.currentUser) {
      await this.atualizarFirebase(id, dados);
    } else {
      this.atualizarLocal(id, dados);
    }
  }

  async deletar(id: string): Promise<void> {
    if (this.auth.currentUser) {
      await this.deletarFirebase(id);
    } else {
      this.deletarLocal(id);
    }
  }
}
