import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NbCardModule, NbSelectModule, NbInputModule, NbButtonModule, NbToggleModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormHandlerService } from '@shared/services/form-handler.service';
import { FormUtils } from '@shared/utils/form-utils';
import { ParameterService } from '@shared/services/parameter.service';
import { CertificatesService } from '@shared/services/certificates.service';
import { NotificationToastService } from '@shared/services/notification-toast-service.service';
import { CertificateField, CertificateType } from '@shared/models/interfaces/certificate.interface';

@Component({
  selector: 'app-parameter-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbToggleModule,
    NbIconModule,
    NbTooltipModule,
    FormsModule
  ],
  templateUrl: './parameter-modal.component.html',
  styleUrls: ['./parameter-modal.component.scss']
})
export class ParameterModalComponent implements OnInit {
  parameterForm: FormGroup;

  // existentes
  typeOptions = [
    { value: 'TEXT', label: 'Texto' },
    { value: 'EMAIL', label: 'Correo electrónico' },
    { value: 'SELECT_SINGLE', label: 'Selección única' },
    { value: 'SELECT_MULTIPLE', label: 'Selección múltiple' },
    { value: 'DATE', label: 'Fecha' },
    { value: 'DATE_RANGE', label: 'Rango de fechas' },
    { value: 'NUMBER', label: 'Número' }
  ];
  sourceOptions = [
    { value: 'SQL', label: 'SQL' },
    { value: 'URL', label: 'URL' },
    { value: 'ESTATICA', label: 'Estática' }
  ];

  certificateTypes: CertificateType[] = [];
  isLoadingCertificateTypes = false;
  isEditMode = false;
  isSubmitting = false;
  modalTitle = 'Crear Nuevo Parámetro';

  dependencies: FormArray;
  staticOptionsArray = [{ key: '', value: '' }];
  dependenciesArray: string[] = [''];

  private _destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  private _router = inject(Router);
  private _formHandlerService = inject(FormHandlerService);
  private _parameterService = inject(ParameterService);
  private _certificatesService = inject(CertificatesService);
  private _notificationService = inject(NotificationToastService);

  constructor() {
    this.parameterForm = this._formHandlerService.createParameterForm();
    this.parameterForm.addControl('sourceType', new FormControl('', Validators.required));
    this.parameterForm.addControl('dataSource', new FormControl(''));
    this.parameterForm.addControl('dependsOn', new FormControl(false));
    this.parameterForm.addControl('dependencies', new FormArray([new FormControl('')]));
    this.parameterForm.addControl('url', new FormControl(''));
    this.parameterForm.addControl('staticOptions', this.fb.array([
      this.fb.group({ key: [''], value: [''] })
    ]));
    this.dependencies = this.parameterForm.get('dependencies') as FormArray;
  }

  ngOnInit(): void {
    this._loadCertificateTypes();
  }

  initialize(parameter: CertificateField, isEdit: boolean = false): void {
    this.isEditMode = isEdit;
    this.modalTitle = isEdit ? 'Editar Parámetro' : 'Crear Nuevo Parámetro';
    if (parameter) {
      const certTypeId = parameter.certificateType?.id || parameter.certificateTypeId;
      this.parameterForm.patchValue({
        name: parameter.name,
        label: parameter.label,
        type: parameter.type,
        required: parameter.required,
        placeholder: parameter.placeholder,
        options: parameter.options ? JSON.stringify(parameter.options) : '',
        minLength: parameter.minLength,
        maxLength: parameter.maxLength,
        minValue: parameter.minValue,
        maxValue: parameter.maxValue,
        certificateTypeId: certTypeId,
        
      });
    }
  }

  private _loadCertificateTypes(): void {
    this.isLoadingCertificateTypes = true;
    this._certificatesService.certificateType
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: types => {
          this.certificateTypes = types;
          this.isLoadingCertificateTypes = false;
        },
        error: () => {
          this._notificationService.showError('Error al cargar tipos de certificados', 'Error');
          this.isLoadingCertificateTypes = false;
        }
      });
  }

  addDependency() {
    this.dependenciesArray.push('');
  }

  removeDependency(i: number) {
    if (this.dependenciesArray.length > 1) {
      this.dependenciesArray.splice(i, 1);
    }
  }

  addStaticOption() {
    this.staticOptionsArray.push({ key: '', value: '' });
  }
  
  removeStaticOption(i: number) {
    if (this.staticOptionsArray.length > 1) {
      this.staticOptionsArray.splice(i, 1);
    }
  }

  isInvalid(controlName: string): boolean {
    return FormUtils.isInvalidAndTouched(this.parameterForm, controlName);
  }

  cancel(): void {
    this._router.navigate(['/parametros/crear']);
  }

  saveParameter(): void {
    if (this.parameterForm.invalid) {
      this.parameterForm.markAllAsTouched();
      this._notificationService.showWarning('Complete los campos requeridos', 'Advertencia');
      return;
    }
    this.isSubmitting = true;
    // ... lógica de creación/actualización
  }
}