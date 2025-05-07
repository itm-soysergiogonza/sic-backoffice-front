import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { NbCardModule, NbSelectModule } from '@nebular/theme';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { CertificatesService } from '@shared/services/certificates.service';
import { FormHandlerService } from '@shared/services/form-handler.service';
import { FormUtils } from '@shared/utils/form-utils';

@Component({
  selector: 'app-create',
  imports: [NbCardModule, NbSelectModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  parameterForm: FormGroup;

  public certificateTypes: CertificateType[] = [];
  public isLoadingCertificateTypes = false;

  public _destroyRef = inject(DestroyRef);
  constructor(
    private _formHandlerService: FormHandlerService,
    private _certificateService: CertificatesService,
  ) {
    this.parameterForm = this._formHandlerService.createParameterForm();
  }

  ngOnInit(): void {
    this._loadCertificateTypes();
  }

  private _loadCertificateTypes(): void {
    this.isLoadingCertificateTypes = true;
    this._certificateService.certificateType
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (types) => {
          this.certificateTypes = types;
          this.isLoadingCertificateTypes = false;
        },
        error: () => {
          this.isLoadingCertificateTypes = false;
        }
      })
  }

  public isInvalid(controlName: string): boolean {
    return FormUtils.isInvalidAndTouched(this.parameterForm, controlName);
  }
}
