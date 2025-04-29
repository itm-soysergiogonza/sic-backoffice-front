import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {NbButtonModule, NbCardModule, NbDialogRef, NbInputModule, NbOptionModule, NbSelectModule } from '@nebular/theme';
import { CertificateField, CertificateType } from '@shared/models/interfaces/certificate.interface';
import { CertificatesService } from '@shared/services/certificates.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-variable-modal',
  imports: [NbCardModule, NbButtonModule, NbInputModule, FormsModule, ReactiveFormsModule, NbOptionModule, NbSelectModule, CommonModule],
  templateUrl: './create-variable-modal.component.html',
  styleUrl: './create-variable-modal.component.scss'
})
export class CreateVariableModalComponent {
  variableForm: FormGroup;
  certificateTypes: CertificateType[] = [];
  private  _destroyRef = inject(DestroyRef);

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

  submit() {
    if (this.variableForm.valid) {
      this._dialogRef.close(this.variableForm.value)
    }
  }

  cancel() {
    this._dialogRef.close();
  }
}
