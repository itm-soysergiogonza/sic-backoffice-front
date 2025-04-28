import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormHandlerService {

  constructor(private _formBuider: FormBuilder) { }

  createParameterForm(): FormGroup {
    return this._formBuider.group({
      name: ['', [Validators.required]],
      label: ['', [Validators.required]],
      type: ['TEXT', [Validators.required]],
      required: [false],
      placeholder: [''],
      options: [null],
      minLength: [null],
      maxLength: [null],
      minValue: [null],
      maxValue: [null],
      certificateTypeId: [2, [Validators.required]]
    });
  }
}
