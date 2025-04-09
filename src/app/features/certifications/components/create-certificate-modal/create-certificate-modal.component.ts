import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbButtonModule, NbInputModule, NbSelectModule, NbCardModule, NbDialogRef } from '@nebular/theme';
import { Certificate, CertificateCategory, OutputFormat } from '../../models/certificate.model';

@Component({
  selector: 'app-create-certificate-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbCardModule
  ],
  templateUrl: './create-certificate-modal.component.html',
  styleUrl: './create-certificate-modal.component.scss'
})
export class CreateCertificateModalComponent {
  certificateForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: NbDialogRef<CreateCertificateModalComponent>
  ) {
    this.certificateForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      purpose: ['', [Validators.required]],
      outputFormat: ['', [Validators.required]]
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    if (this.certificateForm.valid) {
      this.dialogRef.close(this.certificateForm.value);
    }
  }
}
