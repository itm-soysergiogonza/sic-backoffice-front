import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogRef,
  NbInputModule,
  NbSelectModule,
  NB_DIALOG_CONFIG,
  NbDialogConfig,
  NbIconModule
} from '@nebular/theme';
import { NgxDropzoneModule } from 'ngx-dropzone';

@Component({
  selector: 'app-signature-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NgxDropzoneModule,
    NbIconModule
  ],
  templateUrl: './signature-modal.component.html',
  styleUrl: './signature-modal.component.scss'
})
export class SignatureModalComponent {
  signatureForm: FormGroup;
  files: File[] = [];
  users: any[] = [];
  selectedUser: any = null;
  title: string = ''

  constructor(
    private _fb: FormBuilder,
    private _dialogRef: NbDialogRef<SignatureModalComponent>,
    @Inject(NB_DIALOG_CONFIG) protected config: NbDialogConfig
  ) {
    this.signatureForm = this._fb.group({
      description: ['', Validators.required],
      substituteUser: [null, Validators.required]
    });
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  submit() {
    if (this.signatureForm.valid && this.files.length > 0) {
      const formData = new FormData();
      formData.append('file', this.files[0]);
      formData.append('description', this.signatureForm.get('description')?.value);
      formData.append('substituteUserId', this.signatureForm.get('substituteUser')?.value);

      this._dialogRef.close(formData);
    }
  }

  cancel() {
    this._dialogRef.close();
  }
}
