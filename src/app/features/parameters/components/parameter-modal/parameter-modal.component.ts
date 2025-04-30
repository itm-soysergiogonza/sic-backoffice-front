import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogRef, NbInputModule, NbSelectModule, NbToastrService, NbDialogService, NbIconModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { ParameterService } from '@shared/services/parameter.service';
import { CertificateField, CertificateType } from '@shared/models/interfaces/certificate.interface';
import { CertificatesService } from '@shared/services/certificates.service';
import { FormHandlerService } from '@shared/services/form-handler.service';
import { NotificationToastService } from '@shared/services/notification-toast-service.service';
import { FormUtils } from '@shared/utils/form-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-parameter-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbIconModule,
  ],
  templateUrl: './parameter-modal.component.html',
  styleUrl: './parameter-modal.component.scss'
})
export class ParameterModalComponent implements OnInit {
  parameterForm: FormGroup;
  typeOptions = [
    { value: 'TEXT', label: 'Texto' },
    { value: 'EMAIL', label: 'Correo electrónico' },
    { value: 'SELECT_SINGLE', label: 'Selección única' },
    { value: 'SELECT_MULTIPLE', label: 'Selección múltiple' },
    { value: 'DATE', label: 'Fecha' },
    { value: 'DATE_RANGE', label: 'Rango de fechas' },
    { value: 'NUMBER', label: 'Número' }
  ];

  public certificateTypes: CertificateType[] = [];
  public isLoadingCertificateTypes = false;
  public isEditMode = false;
  public modalTitle = 'Crear Nuevo Parámetro';
  public parameterToEdit: CertificateField | null = null;
  public isSubmitting = false;

  private _destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    protected dialogRef: NbDialogRef<ParameterModalComponent>,
    private _parameterService: ParameterService,
    private _certificatesService: CertificatesService,
    private _notificationService: NotificationToastService,
    private _formHandlerService: FormHandlerService
  ) {
    console.log('1. Constructor iniciado');
    this.parameterForm = this._formHandlerService.createParameterForm();
    console.log('2. Formulario base creado');
  }

  ngOnInit(): void {
    this._loadCertificateTypes();
  }

  initialize(parameter: CertificateField, isEdit: boolean = false): void {
    console.log('3. Inicializando modal con parámetro:', parameter);
    this.isEditMode = isEdit;
    this.modalTitle = isEdit ? 'Editar Parámetro' : 'Crear Nuevo Parámetro';

    if (parameter) {
      console.log('4. Configurando parámetro para edición');
      this.parameterToEdit = { ...parameter };
      this._initializeFormWithParameter();
    }
  }

  private _loadCertificateTypes(): void {
    this.isLoadingCertificateTypes = true;
    this._certificatesService.certificateType
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (types) => {
          this.certificateTypes = types;
          this.isLoadingCertificateTypes = false;

          if (this.isEditMode && this.parameterToEdit) {
            const certificateTypeId = this.parameterToEdit.certificateType?.id || this.parameterToEdit.certificateTypeId;
            if (certificateTypeId) {
              this.parameterForm.patchValue({ certificateTypeId });
            }
          }
        },
        error: (error) => {
          console.error('Error cargando tipos de certificados:', error);
          this._notificationService.showError('Error al cargar tipos de certificados', 'Error');
          this.isLoadingCertificateTypes = false;
        }
      });
  }

  private _initializeFormWithParameter(): void {
    if (!this.parameterToEdit) {
        console.warn('No hay parámetro para editar');
        return;
    }

    console.log('6. Iniciando inicialización del formulario');
    console.log('7. Valores actuales del formulario:', this.parameterForm.value);
    console.log('8. Parámetro a editar:', this.parameterToEdit);

    const formValues = {
        name: this.parameterToEdit.name || '',
        label: this.parameterToEdit.label || '',
        type: this.parameterToEdit.type || 'TEXT',
        required: this.parameterToEdit.required ?? false,
        placeholder: this.parameterToEdit.placeholder || '',
        options: this.parameterToEdit.options ? JSON.stringify(this.parameterToEdit.options, null, 2) : '',
        minLength: this.parameterToEdit.minLength || null,
        maxLength: this.parameterToEdit.maxLength || null,
        minValue: this.parameterToEdit.minValue || null,
        maxValue: this.parameterToEdit.maxValue || null,
        certificateTypeId: this.parameterToEdit.certificateType?.id || this.parameterToEdit.certificateTypeId
    };

    console.log('9. Valores preparados para el formulario:', formValues);
    this.parameterForm.patchValue(formValues);
    console.log('10. Formulario actualizado. Nuevos valores:', this.parameterForm.value);
  }

  public saveParameter(): void {
    if (!this._isFormValid()) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.parameterForm.getRawValue();
    const parameterData: Partial<CertificateField> = this._buildParameterData(formValue);

    if (this.isEditMode && this.parameterToEdit?.id) {
      parameterData.id = this.parameterToEdit.id;
      console.log('Actualizando parámetro existente con ID:', this.parameterToEdit.id);

      this._parameterService.updateParameter(this.parameterToEdit.id, parameterData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response: CertificateField) => {
            console.log('Parámetro actualizado exitosamente:', response);
            this._notificationService.showSuccess('Parámetro actualizado exitosamente', 'Éxito');
            this.dialogRef.close(response);
          },
          error: (error: Error) => {
            console.error('Error actualizando parámetro:', error);
            this._notificationService.showError('Error al actualizar el parámetro', 'Error');
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    } else {
      console.log('Creando nuevo parámetro');
      this._parameterService.createParameter(parameterData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response: CertificateField) => {
            console.log('Nuevo parámetro creado:', response);
            this._notificationService.showSuccess('Parámetro creado exitosamente', 'Éxito');
            this.dialogRef.close(response);
          },
          error: (error: Error) => {
            console.error('Error creando parámetro:', error);
            this._notificationService.showError('Error al crear el parámetro', 'Error');
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    }
  }

  private _buildParameterData(formValue: any): Partial<CertificateField> {
    let options: any[] | undefined;

    if (formValue.options) {
      try {
        options = JSON.parse(formValue.options);
      } catch (error) {
        console.warn('Error al parsear las opciones:', error);
      }
    }

    const parameterData: Partial<CertificateField> = {
      name: formValue.name?.trim(),
      label: formValue.label?.trim(),
      type: formValue.type,
      required: formValue.required,
      placeholder: formValue.placeholder?.trim() || undefined,
      options: options,
      minLength: formValue.minLength || undefined,
      maxLength: formValue.maxLength || undefined,
      minValue: formValue.minValue || undefined,
      maxValue: formValue.maxValue || undefined,
      certificateTypeId: formValue.certificateTypeId
    };

    return parameterData;
  }

  private _isFormValid(): boolean {
    if (this.parameterForm.invalid) {
      this.parameterForm.markAllAsTouched();
      this._notificationService.showWarning('Por favor, complete todos los campos requeridos', 'Advertencia');
      return false;
    }
    return true;
  }

  public isInvalid(controlName: string): boolean {
    return FormUtils.isInvalidAndTouched(this.parameterForm, controlName);
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
