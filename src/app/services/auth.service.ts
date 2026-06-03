import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  usuario$: Observable<User | null> = user(this.auth);

  isLoggedIn$: Observable<boolean> = this.usuario$.pipe(
    map(u => u !== null)
  );

  constructor() {}

  cadastrar(email: string, senha: string) {
    return createUserWithEmailAndPassword(this.auth, email, senha);
  }

  login(email: string, senha: string) {
    return signInWithEmailAndPassword(this.auth, email, senha);
  }

  logout() {
    return signOut(this.auth);
  }

  getUsuarioAtual(): User | null {
    return this.auth.currentUser;
  }
}
