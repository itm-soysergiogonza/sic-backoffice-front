import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { Variable } from '@shared/models/interfaces/variables.interface';
import { VariablesService } from '@shared/services/variables.service';
import { NotificationToastService } from '@shared/services/notification-toast-service.service';

@Component({
  selector: 'app-variable-modal',
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
  templateUrl: './variable-modal.component.html',
  styleUrl: './variable-modal.component.scss',
})
export class VariableModalComponent implements OnInit {
  variableForm: FormGroup;

  public modalTitle = '';
  public isSubmitting = false;
  public certificateTypes: CertificateType[] = [];
  private _destroyRef = inject(DestroyRef);
  public isEditMode = false;
  public variableToEdit: Variable | null = null;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: NbDialogRef<VariableModalComponent>,
    private _variableService: VariablesService,
    private _certificatesService: CertificatesService,
    private _notificationService: NotificationToastService
  ) {
    this.variableForm = this._formBuilder.group({
      certificateTypeId: [null, [Validators.required]],
      context: ['', [Validators.required]],
      sql: ['', Validators.required],
      list: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCertificateTypes();
  }

  loadCertificateTypes(): void {
    this._certificatesService.certificateType
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (types) => {
          console.log('Tipos de certificados recibidos:', types);
          if (Array.isArray(types)) {
            this.certificateTypes = types;
          }
        },
        error: (error) => {
          console.error('Error al cargar los tipos de certificados:', error);
        },
      });

    this._certificatesService.getCertificateTypes();
  }

  initialize(variable: Variable, isEdit: boolean = false): void {
    this.isEditMode = isEdit;
    this.modalTitle = isEdit ? 'Editar variable' : 'Crear variable';

    if (variable) {
      this.variableToEdit = { ...variable };
      this._initializeFormWithVariable();
    }
  }

  cancel() {
    this._dialogRef.close();
  }

  private _buildVariableData(formValue: any): Partial<Variable> {
    const variableData: Partial<Variable> = {
      context: formValue.context?.trim(),
      sql: formValue.sql?.trim(),
      list: formValue.list,
      certificateTypeId: formValue.certificateTypeId,
    };

    return variableData;
  }

  private _isFormValid(): boolean {
    if (this.variableForm.invalid) {
      this.variableForm.markAllAsTouched();
      this._notificationService.showError(
        'Por favor, verifique los campos obligatorios',
        'Error'
      );
      return false;
    }
    return true;
  }

  private _initializeFormWithVariable(): void {
    if (!this.variableToEdit) {
      console.warn('No hay variable para editar');
      return;
    }

    const formValues = {
      certificateTypeId: this.variableToEdit.certificateTypeId || null,
      context: this.variableToEdit.context || '',
      sql: this.variableToEdit.sql || '',
      list: this.variableToEdit.list || false,
    };

    this.variableForm.patchValue(formValues);
  }

  public saveVariable(): void {
    if (!this._isFormValid()) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.variableForm.getRawValue();
    const variableData: Partial<Variable> = this._buildVariableData(formValue);

    if (this.isEditMode && this.variableToEdit?.id) {
      variableData.id = this.variableToEdit.id;

      this._variableService
        .updateVariable(this.variableToEdit.id, variableData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response: Variable) => {
            console.log('Variable actualizada exitosamente:', response);
            this._notificationService.showSuccess(
              'Variable actualizada exitosamente',
              'Éxito'
            );
            this._dialogRef.close(response);
          },
          error: (error: Error) => {
            console.error('Error actualizando variable:', error);
            this._notificationService.showError(
              'Error al actualizar la variable',
              'Error'
            );
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
    } else {
      this._variableService
        .createVariable(variableData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response: Variable) => {
            console.log('Nueva variable creada:', response);
            this._notificationService.showSuccess(
              'Variable creada exitosamente',
              'Éxito'
            );
            this._dialogRef.close(response);
          },
          error: (error: Error) => {
            console.error('Error creando variable:', error);
            this._notificationService.showError(
              'Error al crear la variable',
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
}
