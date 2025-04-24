import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
  NbSelectModule,
} from '@nebular/theme';
import { CertificatesService } from '@shared/services/certificates.service';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { ParameterPicklistComponent } from '../parameter-picklist/parameter-picklist.component';

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
    ParameterPicklistComponent,
  ],
  templateUrl: './parameters-page.component.html',
  styleUrl: './parameters-page.component.scss',
})
export class ParametersPageComponent implements OnInit {
  selectedCertificateType: string = '';
  certificateTypes: CertificateType[] = [];
  selectedCertificate: CertificateType | null = null;

  constructor(private certificatesService: CertificatesService) {}

  ngOnInit(): void {
    // Suscribirse a los tipos de certificados
    this.certificatesService.certificateType.subscribe(
      types => {
        this.certificateTypes = types;
      }
    );

    // Cargar los tipos de certificados
    this.certificatesService.getCertificateTypes();
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
}
