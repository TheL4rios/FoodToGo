import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UtilsService } from '../utils/utils.service';
import { WindowService } from '../windows/window-service.service';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class FirestoreUtilsService {

  constructor(private firestore: AngularFirestore,
              private util: UtilsService,
              private win: WindowService,
              private fireAuth: AngularFireAuth) { }

  currentUser() {
    this.fireAuth.onAuthStateChanged((user) => {
      if (user) {
        this.win.navigateTo('/tabs');
      }
    });
  }

  signIn(email: string, password: string) {
    this.fireAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.win.navigateTo('/tabs');
      })
      .catch(() => {
        this.util.showMessageAlert('Atención', 'El correo o la contraseña son incorrectos');
      });
  }

  signOut() {
    this.fireAuth.signOut()
      .then(() => {
        this.win.navigateTo('/login');
      })
      .catch(() => {
        this.util.showMessageAlert('Atención', 'Algo salió mal, verifique su conexión a internet');
      });
  }

  saveProduct(product: Product) {
    return this.firestore.collection('Products').add(product);
  }

  getProducts() {
    return this.firestore.collection('Products').snapshotChanges();
  }
}
