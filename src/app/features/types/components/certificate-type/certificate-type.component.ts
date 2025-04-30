import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbTreeGridModule,
  NbIconModule,
  NbSelectModule,
  NbDialogService,
} from '@nebular/theme';
import {
  CertificateType,
} from '@shared/models/interfaces/certificate.interface';
import { TypesListComponent } from '../types-list/types-list.component';
import { TypesModalComponent } from '../types-modal/types-modal.component';

@Component({
  selector: 'app-certificate-type',
  imports: [
    CommonModule,
    FormsModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    NbTreeGridModule,
    NbIconModule,
    NbSelectModule,
    TypesListComponent,
  ],
  templateUrl: './certificate-type.component.html',
  styleUrl: './certificate-type.component.scss',
})
export class CertificateTypeComponent {
  @ViewChild(TypesListComponent) nbTableComponent!: TypesListComponent;

  constructor(private _dialogService: NbDialogService) {}

  openCertificateTypeModal(): void {
    this._dialogService
      .open(TypesModalComponent, {
        context: {
          isEditMode: false,
          modalTitle: 'Crear Nuevo Tipo de Certificado',
        },
        closeOnBackdropClick: false,
        closeOnEsc: false,
      })
      .onClose.subscribe((newParameter: CertificateType | null) => {
        if (newParameter) {
          this.nbTableComponent.refreshTable();
        }
      });
  }
}
