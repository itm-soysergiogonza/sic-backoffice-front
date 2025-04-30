import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbButtonModule, NbInputModule, NbSelectModule, NbCardModule, NbDialogRef, NbOptionModule } from '@nebular/theme';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { NotificationToastService } from '@shared/services/notification-toast-service.service';
import { Template } from '@shared/models/interfaces/template.interface';
import { TemplateService } from '@shared/services/template.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CertificatesService } from '@shared/services/certificates.service';

@Component({
  selector: 'app-template-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbCardModule,
    NbOptionModule
  ],
  templateUrl: './template-modal.component.html',
  styleUrl: './template-modal.component.scss'
})
export class TemplateModalComponent implements OnInit {
  templateForm: FormGroup;
  public certificateTypes: CertificateType[] = [];
  public isEditMode = false;
  public templateToEdit: Template | null = null;
  public modalTitle = 'Crear Nueva Plantilla';
  public isSubmitting = false;

  private _destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: NbDialogRef<TemplateModalComponent>,
    private _notificationService: NotificationToastService,
    private _templateService: TemplateService,
    private _certificatesService: CertificatesService
  ) {
    this.templateForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      content: ['', [Validators.required]],
      certificateTypeId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCertificateTypes();
  }

  loadCertificateTypes(): void {
    this._certificatesService.certificateType
      .subscribe({
        next: (types) => {
          if (Array.isArray(types)) {
            this.certificateTypes = types;
          }
        },
        error: (error) => {
          console.error('Error al cargar los tipos de certificados:', error);
          this._notificationService.showError('Error al cargar los tipos de certificados', 'Error');
        }
      });

    this._certificatesService.getCertificateTypes();
  }

  initialize(template: Template, isEdit: boolean = false): void {
    this.isEditMode = isEdit;
    this.modalTitle = isEdit ? 'Editar Plantilla' : 'Crear Nueva Plantilla';

   if (template) {
      console.log('4. Configurando parámetro para edición');
      this.templateToEdit = { ...template };
      this._initializeFormWithTemplate();
    }
  }

  cancel() {
    this._dialogRef.close();
  }

  private _buildTemplateData(formValue: any): Partial<Template> {
    const templateData: Partial<Template> = {
      name: formValue.name?.trim(),
      content: formValue.content?.trim(),
      certificateTypeId: formValue.certificateTypeId
    };

    return templateData;
  }

  private _isFormValid(): boolean {
    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      this._notificationService.showError('Por favor, verifique los campos obligatorios', 'Error');
      return false;
    }
    return true;
  }

  private _initializeFormWithTemplate(): void {
    if (!this.templateToEdit) {
      console.warn('No hay parámetro para editar');
      return;
    }

    const formValues = {
      name: this.templateToEdit.name || '',
      content: this.templateToEdit.content || '',
      certificateTypeId: this.templateToEdit.id || this.templateToEdit.certificateTypeId
    };

    console.log('9. Valores preparados para el formulario:', formValues);
    this.templateForm.patchValue(formValues);
    console.log('10. Formulario actualizado. Nuevos valores:', this.templateForm.value);
  }

  public saveTemplate(): void {
    if (!this._isFormValid()) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.templateForm.getRawValue();
    const templateData: Partial<Template> = this._buildTemplateData(formValue);

    if (this.isEditMode && this.templateToEdit?.id) {
      templateData.id = this.templateToEdit.id;

      this._templateService.updateTemplate(this.templateToEdit.id, templateData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response: Template) => {
            console.log('Plantilla actualizada exitosamente:', response);
            this._notificationService.showSuccess('Plantilla actualizada exitosamente', 'Éxito');
            this._dialogRef.close(response);
          },
          error: (error: Error) => {
            console.error('Error actualizando plantilla:', error);
            this._notificationService.showError('Error al actualizar la plantilla', 'Error');
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    } else {
      this._templateService.createTemplate(templateData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response: Template) => {
            console.log('Nueva plantilla creada:', response);
            this._notificationService.showSuccess('Plantilla creada exitosamente', 'Éxito');
            this._dialogRef.close(response);
          },
          error: (error: Error) => {
            console.error('Error creando plantilla:', error);
            this._notificationService.showError('Error al crear la plantilla', 'Error');
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    }
  }
}
