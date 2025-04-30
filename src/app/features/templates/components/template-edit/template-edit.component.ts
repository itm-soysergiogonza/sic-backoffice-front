import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { EditorComponent } from '@features/code-editor/components/editor/editor.component';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbFormFieldModule, NbSelectModule, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorService, Template, CreateTemplateDTO } from '@features/code-editor/services/editor.service';
import { Router } from '@angular/router';
import { CertificatesService } from '@shared/services/certificates.service';

interface TemplateForm {
  certificateTypeId: number;
  name: string;
  content: string;
}

@Component({
  selector: 'app-template-edit',
  imports: [
    CommonModule,
    NbBadgeModule,
    NbCardModule,
    EditorComponent,
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    NbFormFieldModule,
    NbSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './template-edit.component.html',
  styleUrl: './template-edit.component.scss',
})
export class TemplateEditComponent implements OnInit, OnChanges {
  @Input() certificate!: CertificateType;
  @Input() templateId?: number;
  templateForm: FormGroup;
  isSaving = false;
  certificateTypes: CertificateType[] = [];

  constructor(
    private fb: FormBuilder,
    private _editorService: EditorService,
    private _toastrService: NbToastrService,
    private _router: Router,
    private _certificatesService: CertificatesService
  ) {
    this.templateForm = this.fb.group({
      certificateTypeId: [null, Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', Validators.required]
    });

    // Subscribe to form changes to debug
    this.templateForm.valueChanges.subscribe(value => {
      console.log('Form value:', value);
      console.log('Form valid:', this.templateForm.valid);
      console.log('Form errors:', this.templateForm.errors);
      console.log('Name errors:', this.templateForm.get('name')?.errors);
      console.log('Content errors:', this.templateForm.get('content')?.errors);
      console.log('CertificateTypeId errors:', this.templateForm.get('certificateTypeId')?.errors);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['certificate'] && changes['certificate'].currentValue) {
      this.templateForm.patchValue({
        certificateTypeId: this.certificate.id
      });
    }
  }

  ngOnInit() {
    // Load certificate types
    this._certificatesService.certificateType.subscribe({
      next: (types: CertificateType[]) => {
        this.certificateTypes = types;
      },
      error: (error) => {
        console.error('Error loading certificate types:', error);
        this._toastrService.danger('Error al cargar los tipos de certificados', 'Error');
      }
    });

    // Load certificate types initially
    this._certificatesService.getCertificateTypes();

    if (this.templateId) {
      this._editorService.getTemplateById(this.templateId).subscribe({
        next: (template: Template) => {
          this.templateForm.patchValue({
            certificateTypeId: template.certificateType.id,
            name: template.name,
            content: template.content
          });
        },
        error: (error) => {
          console.error('Error loading template:', error);
          this._toastrService.danger('Error al cargar el template', 'Error');
        }
      });
    } else {
      // Initialize with base content
      this.templateForm.patchValue({
        content: '<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Certificado</h1>\n  </body>\n</html>'
      });
    }
  }

  saveTemplate() {
    if (this.templateForm.valid) {
      this.isSaving = true;
      const selectedCertificateId = this.templateForm.value.certificateTypeId;
      
      if (!selectedCertificateId) {
        this._toastrService.warning('Por favor seleccione un tipo de certificado', 'Validación');
        this.isSaving = false;
        return;
      }

      const templateData: CreateTemplateDTO = {
        certificateTypeId: selectedCertificateId,
        name: this.templateForm.value.name,
        content: this.templateForm.value.content
      };

      this._editorService.saveTemplate(templateData).subscribe({
        next: (template: Template) => {
          this._toastrService.success('Template guardado exitosamente', 'Éxito');
          this.templateId = template.id;
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Error saving template:', error);
          this._toastrService.danger('Error al guardar el template', 'Error');
          this.isSaving = false;
        }
      });
    } else {
      console.log('Form is invalid:', this.templateForm.errors);
      this._toastrService.warning('Por favor complete todos los campos requeridos', 'Validación');
    }
  }

  onEditorContentChange(content: string) {
    this.templateForm.patchValue({ content });
  }
}
