import { Injectable } from '@angular/core';
import {NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastRef, NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class NotificationToastService {
  constructor(private _toastrService: NbToastrService) { }

  positions:typeof NbGlobalPhysicalPosition = NbGlobalPhysicalPosition;

  private _showToast(message: string, title: string, status: NbComponentStatus) {
    this._toastrService.show(message, title, {
      status,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      duration: 3000,
    });
  }

  showSuccess(message: string, title: string = 'Éxito') {
    this._showToast(message, title, 'success');
  }

  showError(message: string, title: string = 'Error') {
    this._showToast(message, title, 'danger');
  }

  showWarning(message: string, title: string = 'Advertencia') {
    this._showToast(message, title, 'warning');
  }

  showInfo(message: string, title: string = 'Información') {
    this._showToast(message, title, 'info');
  }



}




