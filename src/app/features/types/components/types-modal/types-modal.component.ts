import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogRef,
  NbInputModule,
  NbOptionModule,
  NbSelectModule,
} from '@nebular/theme';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { CertificatesService } from '@shared/services/certificates.service';
import { FormHandlerService } from '@shared/services/form-handler.service';
import { NotificationToastService } from '@shared/services/notification-toast-service.service';

@Component({
  selector: 'app-types-modal',
  imports: [
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    FormsModule,
    ReactiveFormsModule,
    NbOptionModule,
    NbSelectModule,
    CommonModule,
  ],
  templateUrl: './types-modal.component.html',
  styleUrl: './types-modal.component.scss',
})
export class TypesModalComponent {
  typeForm: FormGroup;

  public isEditMode = false;
  public modalTitle = 'Crear Nuevo Tipo Certificado';
  public typeToEdit: CertificateType | null = null;
  public isSubmitting = false;

  private _destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    protected dialogRef: NbDialogRef<TypesModalComponent>,
    private _notificationService: NotificationToastService,
    private _formHandlerService: FormHandlerService,
    private _formBuilder: FormBuilder,
    private _certificateTypeService: CertificatesService
  ) {
    this.typeForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      paid: [false, Validators.required],
      price: [0, Validators.required],
    });
  }

  ngOnInit(): void {}

  initialize(type: CertificateType, isEdit: boolean = false): void {
    this.isEditMode = isEdit;
    this.modalTitle = isEdit
      ? 'Editar Tipo Certificado'
      : 'Crear Nuevo Tipo Certificado';

    if (type) {
      this.typeToEdit = { ...type };
      this._initializeFormWithType();
    }
  }

  private _initializeFormWithType(): void {
    if (!this.typeToEdit) {
      console.warn('No hay tipo para editar');
      return;
    }

    const formValues = {
      name: this.typeToEdit.name || '',
      paid: this.typeToEdit.paid || false,
      price: this.typeToEdit.price,
    };

    this.typeForm.patchValue(formValues);
  }

  private _isFormValid(): boolean {
    if (this.typeForm.invalid) {
      this.typeForm.markAllAsTouched();
      this._notificationService.showError(
        'Por favor, verifique los campos obligatorios',
        'Error'
      );
      return false;
    }
    return true;
  }

  private _buildTypeData(formValue: any): Partial<CertificateType> {
    const typeData: Partial<CertificateType> = {
      name: formValue.name?.trim(),
      paid: formValue.paid,
      price: formValue.price,
    };

    return typeData;
  }

  saveType(): void {
    if (!this._isFormValid()) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.typeForm.getRawValue();
    const typeData: Partial<CertificateType> = this._buildTypeData(formValue);

    if (this.isEditMode && this.typeToEdit?.id) {
      typeData.id = this.typeToEdit.id;

      this._certificateTypeService
        .updateCertificateType(this.typeToEdit.id, typeData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response: CertificateType) => {
            this._notificationService.showSuccess(
              'Tipo de Certificado actualizado exitosamente',
              'Éxito'
            );
            this.dialogRef.close(response);
          },
          error: (error: Error) => {
            this._notificationService.showError(
              'Error al actualizar el tipo de certificado',
              'Error'
            );
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
    } else {
      this._certificateTypeService
        .createCertificateType(typeData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response: CertificateType) => {
            this._notificationService.showSuccess(
              'Tipo de Certificado creado exitosamente',
              'Éxito'
            );
            this.dialogRef.close(response);
          },
          error: (error: Error) => {
            this._notificationService.showError(
              'Error al crear el tipo de certificado',
              'Error'
            );
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
