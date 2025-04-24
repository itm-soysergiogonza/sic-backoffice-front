import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NbButtonModule, NbIconModule, NbCardModule, NbTooltipModule } from '@nebular/theme';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';

@Component({
  selector: 'app-certification-card',
  standalone: true,
  imports: [
    CommonModule,
    NbButtonModule,
    NbIconModule,
    NbCardModule,
    NbTooltipModule
  ],
  templateUrl: './certification-card.component.html',
  styleUrls: ['./certification-card.component.scss']
})
export class CertificationCardComponent {
  @Input() certificate!: CertificateType;

  constructor(private _router: Router) {}

  onViewDetails(): void {
    this._router.navigate([`/certificados/${this.certificate.id}/editar`]);
  }
}
