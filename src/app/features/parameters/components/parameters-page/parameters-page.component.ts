import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
  NbSelectModule,
  NbDialogService,
} from '@nebular/theme';
import { CertificatesService } from '@shared/services/certificates.service';
import {CertificateField, CertificateType } from '@shared/models/interfaces/certificate.interface';
import { NbTableComponent } from '../nb-table/nb-table.component';
import { ParameterService } from '@shared/services/parameter.service';
import {Subject } from 'rxjs';
import { ParameterModalComponent } from '../parameter-modal/parameter-modal.component';

@Component({
  selector: 'app-parameters-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    NbTreeGridModule,
    NbIconModule,
    NbSelectModule,
    NbTableComponent
  ],
  templateUrl: './parameters-page.component.html',
  styleUrl: './parameters-page.component.scss',
})
export class ParametersPageComponent implements OnInit {
  @ViewChild(NbTableComponent) nbTableComponent!: NbTableComponent;
  selectedCertificateType: string = '';
  certificateTypes: CertificateType[] = [];
  selectedCertificate: CertificateType | null = null;
  private _destroy$ = new Subject<void>();

  constructor(private _certificatesService: CertificatesService,
              private _parameterService: ParameterService,
              private _dialogService: NbDialogService) {}

  ngOnInit(): void {
    this._certificatesService.certificateType.subscribe(
      types => {
        this.certificateTypes = types;
      }
    );

    this._certificatesService.getCertificateTypes();
  }

  getSelectedCertificateLabel(): string {
    const selectedType = this.certificateTypes.find(
      type => type.id === Number(this.selectedCertificateType)
    );
    return selectedType?.name || '';
  }

  onCertificateTypeChange(value: string): void {
    this.selectedCertificateType = value;
    this.selectedCertificate = this.certificateTypes.find(
      type => type.id === Number(value)
    ) || null;
  }

  openParameterModal(): void {
    this._dialogService.open(ParameterModalComponent, {
      context: {
        certificateTypes: this.certificateTypes,
        isEditMode: false,
        modalTitle: 'Crear Nuevo Parámetro',
      },
      closeOnBackdropClick: false,
      closeOnEsc: false,
    })
      .onClose.subscribe((newParameter: CertificateField | null) => {
        if (newParameter) {
          this.nbTableComponent.parameters.push(newParameter);
          this.nbTableComponent.updateDataSource(this.nbTableComponent.parameters);
        }
    })
  }
}
