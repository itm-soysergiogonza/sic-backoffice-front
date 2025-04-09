import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbBadgeModule, NbCardModule } from '@nebular/theme';
import { Certificate } from '../../models/certificate.model';

@Component({
  selector: 'app-certification-details',
  standalone: true,
  imports: [CommonModule, NbBadgeModule, NbCardModule],
  templateUrl: './certification-details.component.html',
  styleUrl: './certification-details.component.scss',
})
export class CertificationDetailsComponent {
  @Input() certificate!: Certificate;

  getStatusBadge(): string {
    switch (this.certificate?.status) {
      case 'Completado':
        return 'success';
      case 'En Proceso':
        return 'info';
      case 'Rechazado':
        return 'danger';
      default:
        return 'warning';
    }
  }
}
