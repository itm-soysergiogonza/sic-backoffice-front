import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbBadgeModule, NbCardModule } from '@nebular/theme';
import { Certificate } from '../../models/certificate.model';
import { EditorComponent } from '@features/code-editor/components/editor/editor.component';

@Component({
  selector: 'app-certification-details',
  standalone: true,
  imports: [CommonModule, NbBadgeModule, NbCardModule, EditorComponent],
  templateUrl: './certification-details.component.html',
  styleUrl: './certification-details.component.scss',
})
export class CertificationDetailsComponent {
  @Input() certificate!: Certificate;
}
