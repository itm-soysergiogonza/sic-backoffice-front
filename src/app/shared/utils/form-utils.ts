import {AbstractControl, FormGroup } from "@angular/forms";

export class FormUtils {
  static isInvalidAndTouched(form: FormGroup, controlName: string): boolean {
    const control:AbstractControl<any, any> | null = form.get(controlName);
    return !!control && control.invalid && (control.touched);
  }

  static markAllAsTouched(form: FormGroup): void {
    Object.values(form.controls).forEach(control => {
     control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    })
  }
}
