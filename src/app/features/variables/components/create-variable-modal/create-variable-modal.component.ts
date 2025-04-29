import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {NbButtonModule, NbCardModule, NbDialogRef, NbInputModule, NbOptionModule } from '@nebular/theme';

@Component({
  selector: 'app-create-variable-modal',
  imports: [NbCardModule, NbButtonModule, NbInputModule, FormsModule, ReactiveFormsModule, NbOptionModule],
  templateUrl: './create-variable-modal.component.html',
  styleUrl: './create-variable-modal.component.scss'
})
export class CreateVariableModalComponent {
  variableForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: NbDialogRef<CreateVariableModalComponent>
  ) {
    this.variableForm = this._formBuilder.group({
      certificateTypeId: [null, [Validators.required]],
      context: ['', [Validators.required]],
      sql: ['', Validators.required],
      list: [false, Validators.required],
    });
  }

  submit() {
    if (this.variableForm.valid) {
      const body = this.variableForm.value;
      this._dialogRef.close(this.variableForm.value)
    }
  }

  cancel() {
    this._dialogRef.close();
  }
}
