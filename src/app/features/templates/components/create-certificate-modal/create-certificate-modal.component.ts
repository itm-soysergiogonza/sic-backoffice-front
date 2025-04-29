import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbButtonModule, NbInputModule, NbSelectModule, NbCardModule, NbDialogRef } from '@nebular/theme';

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
    private _formBuilder: FormBuilder,
    private _dialogRef: NbDialogRef<CreateCertificateModalComponent>
  ) {
    this.certificateForm = this._formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  cancel() {
    this._dialogRef.close();
  }

  submit() {
    if (this.certificateForm.valid) {
      this._dialogRef.close(this.certificateForm.value);
    }
  }
}
