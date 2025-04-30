import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CertificateType, CertificateField } from '@shared/models/interfaces/certificate.interface';
import { EditorComponent } from '@features/code-editor/components/editor/editor.component';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbFormFieldModule, NbSelectModule, NbToastrService, NbAccordionModule, NbTooltipModule } from '@nebular/theme';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorService, Template, CreateTemplateDTO } from '@features/code-editor/services/editor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CertificatesService } from '@shared/services/certificates.service';
import { ParameterService } from '@shared/services/parameter.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';

interface TemplateForm {
  certificateTypeId: number;
  name: string;
  content: string;
}

@Component({
  selector: 'app-template-create',
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
    NbAccordionModule,
    NbTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './template-create.component.html',
  styleUrl: './template-create.component.scss',
})
export class TemplateCreateComponent implements OnInit {
  templateForm: FormGroup;
  isSaving = false;
  certificateTypes: CertificateType[] = [];
  parameters: CertificateField[] = [];
  showParameters = false;
  templateId: number | undefined;
  private _destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private _editorService: EditorService,
    private _toastrService: NbToastrService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _certificatesService: CertificatesService,
    private _parameterService: ParameterService
  ) {
    this.templateForm = this.fb.group({
      certificateTypeId: [null, Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', Validators.required]
    });

    // Subscribe to certificateTypeId changes to load parameters
    this.templateForm.get('certificateTypeId')?.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(certificateTypeId => {
        if (certificateTypeId) {
          this.loadParameters(certificateTypeId);
        }
      });
  }

  ngOnInit() {
    // Load certificate types
    this._certificatesService.certificateType
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
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

    // Get template ID from route parameters
    this._route.params
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(params => {
        const id = params['id'];
        this.templateId = id ? Number(id) : undefined;
        if (this.templateId) {
          this._editorService.getTemplateById(this.templateId)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
              next: (template: Template) => {
                console.log('Template loaded:', template);
                this.templateForm.patchValue({
                  certificateTypeId: template.certificateType.id,
                  name: template.name,
                  content: template.content
                });
                // Load parameters for the certificate type
                this.loadParameters(template.certificateType.id);
              },
              error: (error) => {
                console.error('Error loading template:', error);
                this._toastrService.danger('Error al cargar el template', 'Error');
                this._router.navigate(['/plantillas']);
              }
            });
        } else {
          this._router.navigate(['/plantillas/crear']);
        }
      });
  }

  loadParameters(certificateTypeId: number) {
    this._parameterService.getParametersByCertificateType(certificateTypeId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (parameters: CertificateField[]) => {
          this.parameters = parameters;
        },
        error: (error) => {
          console.error('Error loading parameters:', error);
          this._toastrService.danger('Error al cargar los parámetros', 'Error');
        }
      });
  }

  toggleParameters() {
    this.showParameters = !this.showParameters;
  }

  insertParameter(parameter: CertificateField) {
    const parameterTag = `\${${parameter.name}}`;
    // Emit to editor component
    this.onEditorContentChange(this.templateForm.get('content')?.value + parameterTag);
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

      this._editorService.saveTemplate(templateData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (template: Template) => {
            this._toastrService.success('Template guardado exitosamente', 'Éxito');
            this._router.navigate(['/plantillas', template.id, 'editar']);
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
