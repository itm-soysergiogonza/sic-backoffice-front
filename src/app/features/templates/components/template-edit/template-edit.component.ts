import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { EditorComponent } from '@features/code-editor/components/editor/editor.component';
import { NbBadgeModule, NbCardModule } from '@nebular/theme';

@Component({
  selector: 'app-template-edit',
  imports: [CommonModule, NbBadgeModule, NbCardModule, EditorComponent],
  templateUrl: './template-edit.component.html',
  styleUrl: './template-edit.component.scss',
})
export class TemplateEditComponent {
  @Input() certificate!: CertificateType;
}
