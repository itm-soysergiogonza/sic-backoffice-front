import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { EditorComponent } from '@features/code-editor/components/editor/editor.component';
import { NbBadgeModule, NbCardModule } from '@nebular/theme';

@Component({
  selector: 'app-certification-edit',
  imports: [CommonModule, NbBadgeModule, NbCardModule, EditorComponent],
  templateUrl: './certification-edit.component.html',
  styleUrl: './certification-edit.component.scss',
})
export class CertificationEditComponent {
  @Input() certificate!: CertificateType;
}
