import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '../services/utils/utils.service';
import { FirestoreUtilsService } from '../services/firestore/firestore-utils.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  productGroup: FormGroup;
  ingredients: string[] = [];

  constructor(private fb: FormBuilder, private utils: UtilsService, private firestore: FirestoreUtilsService) {
    this.initilizeForm();
  }

  initilizeForm() {
    this.productGroup = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]+.[0-9]{2}')])],
      check: [false],
      ingredient: ['']
    });
  }

  addIngredient() {
    const ingredient = this.productGroup.get('ingredient').value;

    if (ingredient !== '') {
      this.ingredients.push(ingredient);
      this.productGroup.get('ingredient').setValue('');
    } else {
      this.utils.showMessageAlert('Atención', 'Ingrese un ingrediente para poder agregarlo');
    }
  }

  removeIngredient(index: number) {
    this.ingredients.splice(index, 1);
  }

  clearIngredients() {
    if (!this.productGroup.get('ingredient').value) {
      this.ingredients = [];
    }
  }

  saveProduct() {
    let product: Product;

    if (!this.productGroup.valid) {
      this.utils.showMessageAlert('Atención', 'Ingrese correctamente los valores');
      return;
    }

    if (this.ingredients.length !== 0) {
      product = {
        name: this.productGroup.get('name').value,
        price: parseFloat(this.productGroup.get('price').value),
        ingredients: this.ingredients
      };
    } else {
      product = {
        name: this.productGroup.get('name').value,
        price: parseFloat(this.productGroup.get('price').value)
      };
    }

    this.firestore.saveProduct(product)
      .then(() => {
        this.productGroup.get('name').setValue('');
        this.productGroup.get('price').setValue('');
        this.ingredients = [];
        this.utils.showMessageToast('Se registro el producto exitosamente');
      })
      .catch(() => {
        this.utils.showMessageAlert('Atención', 'Algo salió mal, por favor verifique su conexión a internet');
      });
  }
}

