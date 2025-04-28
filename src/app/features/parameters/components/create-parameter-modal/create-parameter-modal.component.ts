import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogRef, NbInputModule, NbSelectModule, NbToastrService } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { ParameterService } from '@shared/services/parameter.service';
import { CertificateField, FieldType, CertificateType, FieldOption } from '@shared/models/interfaces/certificate.interface';
import { CertificatesService } from '@shared/services/certificates.service';
import { FormHandlerService } from '@shared/services/form-handler.service';
import { NotificationToastService } from '@shared/services/notification-toast-service.service';
import { FormUtils } from '@shared/utils/form-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-parameter-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
  ],
  templateUrl: './create-parameter-modal.component.html',
  styleUrl: './create-parameter-modal.component.scss'
})
export class CreateParameterModalComponent implements OnInit {
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

  certificateTypes: CertificateType[] = [];
  isLoadingCertificateTypes = false;

  private _destroyRef: DestroyRef = inject(DestroyRef);
  isSubmitting = false;

  constructor(
    private _dialogRef: NbDialogRef<CreateParameterModalComponent>,
    private _parameterService: ParameterService,
    private _certificatesService: CertificatesService,
    private _notificationService: NotificationToastService,
    private _formHandlerService: FormHandlerService
  ) {
    this.parameterForm = this._formHandlerService.createParameterForm();
  }

  ngOnInit(): void {
    this.loadCertificateTypes();
  }

  loadCertificateTypes(): void {
    this.isLoadingCertificateTypes = true;
    this._certificatesService.certificateType
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (types) => {
          this.certificateTypes = types;
          this.isLoadingCertificateTypes = false;
          this.parameterForm.get('certificateTypeId')?.enable();
        },
        error: (error) => {
          console.error('Error cargando tipos de certificados:', error);
          this._notificationService.showError('Error al cargar tipos de certificados', 'Error');
          this.isLoadingCertificateTypes = false;
        }
      });
  }

  private _buildParameterData(formValue:Partial<CertificateField>): Partial<CertificateField> {
    const {
      name,
      label,
      type,
      required,
      placeholder,
      options,
      minLength,
      maxLength,
      minValue,
      maxValue,
      certificateTypeId
    } = formValue;

    let parsedOptions: FieldOption[] | undefined = undefined;

    if (typeof options === 'string') {
      try {
        parsedOptions = JSON.parse(options);
      } catch (error) {
        console.warn('Error parseando opciones:', error);
      }
    }

    return {
      name: name,
      label:label,
      type: type as FieldType,
      required: required ?? false,
      placeholder: placeholder ?? undefined,
      options: parsedOptions,
      minLength: minLength ? String(minLength) : undefined,
      maxLength: maxLength ? String(maxLength) : undefined,
      minValue: minValue ? String(minValue) : undefined,
      maxValue: maxValue ? String(maxValue) : undefined,
      certificateTypeId: certificateTypeId ? Number(certificateTypeId) : undefined
    }
  }

  private _createParameter(parameterData:any) {
    this._parameterService.createParameter(parameterData)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: CertificateField): void => {
          if (response && response.id) {
            this._notificationService.showSuccess('Parámetro creado exitosamente', 'Éxito');
            this._dialogRef.close(response);
          } else {
            this._notificationService.showWarning('El parámetro se creó pero hubo un problema con la respuesta', 'Advertencia');
            this._dialogRef.close(null);
          }
        },
        error: (error: Error):void => {
          console.error('Error creando parámetro:', error);
          this._notificationService.showError('Error al crear el parámetro', 'Error');
          this._dialogRef.close(null)
        },
      });
  }

  private _isFormValid(): boolean {
    if (this.parameterForm.invalid) {
      this.parameterForm.markAllAsTouched();
      this._notificationService.showWarning('Por favor, complete todos los campos requeridos', 'Advertencia');
      return false;
    }

    const formValue = this.parameterForm.getRawValue();
    const selectedCertificateType = this.certificateTypes.find(
      type => type.id === Number(formValue.certificateTypeId)
    );

    if (!selectedCertificateType) {
      this._notificationService.showError('Debe seleccionar un tipo de certificado válido', 'Error');
      return false;
    }

    return true;
  }

  saveParameter(): void {
    if (!this._isFormValid()) {
      return;
    }

   this.isSubmitting = true;
   const formValue = this.parameterForm.getRawValue();
   const parameterData:Partial<CertificateField> = this._buildParameterData(formValue);
   this._createParameter(parameterData);
  }

  isInvalid(controlName: string): boolean {
    return FormUtils.isInvalidAndTouched(this.parameterForm, controlName);
  }

  cancel(): void {
    this._dialogRef.close();
  }


}
