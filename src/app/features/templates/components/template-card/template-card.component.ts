import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NbButtonModule, NbIconModule, NbCardModule, NbTooltipModule } from '@nebular/theme';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';

@Component({
  selector: 'app-template-card',
  standalone: true,
  imports: [
    CommonModule,
    NbButtonModule,
    NbIconModule,
    NbCardModule,
    NbTooltipModule
  ],
  templateUrl: './template-card.component.html',
  styleUrls: ['./template-card.component.scss']
})
export class TemplateCardComponent {
  @Input() certificate!: CertificateType;

  constructor(private _router: Router) {}

  onViewDetails(): void {
    this._router.navigate([`/certificados/${this.certificate.id}/editar`]);
  }
}
