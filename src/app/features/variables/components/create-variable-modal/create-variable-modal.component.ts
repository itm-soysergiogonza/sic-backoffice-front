import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {NbButtonModule, NbCardModule, NbDialogRef, NbInputModule, NbOptionModule, NbSelectModule } from '@nebular/theme';
import { CertificateField, CertificateType } from '@shared/models/interfaces/certificate.interface';
import { CertificatesService } from '@shared/services/certificates.service';
import { CommonModule } from '@angular/common';
import { Variable } from '@shared/models/interfaces/variables.interface';

@Component({
  selector: 'app-create-variable-modal',
  imports: [NbCardModule, NbButtonModule, NbInputModule, FormsModule, ReactiveFormsModule, NbOptionModule, NbSelectModule, CommonModule],
  templateUrl: './create-variable-modal.component.html',
  styleUrl: './create-variable-modal.component.scss'
})
export class CreateVariableModalComponent {
  variableForm: FormGroup;
  certificateTypes: CertificateType[] = [];
  private _destroyRef = inject(DestroyRef);
  isEditMode = false;
  currentVariable: Variable | null = null;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: NbDialogRef<CreateVariableModalComponent>,
    private _certificatesService: CertificatesService
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
       }
     });

   this._certificatesService.getCertificateTypes();
 }

  initialize(variable: Variable, isEdit: boolean = false): void {
    this.isEditMode = isEdit;
    this.currentVariable = variable;
    
    if (isEdit && variable) {
      this.variableForm.patchValue({
        certificateTypeId: variable.certificateTypeId,
        context: variable.context,
        sql: variable.sql,
        list: variable.list
      });
    }
  }

  submit() {
    if (this.variableForm.valid) {
      const formData = this.variableForm.value;
      if (this.isEditMode && this.currentVariable) {
        formData.id = this.currentVariable.id;
      }
      this._dialogRef.close(formData);
    }
  }

  cancel() {
    this._dialogRef.close();
  }
}
