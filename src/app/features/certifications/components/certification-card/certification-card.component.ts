import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NbButtonModule, NbIconModule, NbCardModule, NbTooltipModule } from '@nebular/theme';
import { Certificate } from '../../models/certificate.model';

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
  @Input() certificate!: Certificate;

  constructor(private router: Router) {}

  onViewDetails(): void {
    this.router.navigate(['/certificados', this.certificate.id]);
  }
}
