import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CertificateTypeEvent } from '@shared/models/interfaces/certificate.interface';
import { NbSelectModule, NbSpinnerModule, NbIconModule } from '@nebular/theme';
import { CertificatesService } from '@shared/services/certificates.service';
import { Observable, Subscription, finalize } from 'rxjs';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { ParameterPicklistComponent } from '@features/parameters/components/parameter-picklist/parameter-picklist.component';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [
    CommonModule, 
    NbSelectModule, 
    NbSpinnerModule,
    NbIconModule,
    ReactiveFormsModule, 
    FormsModule,
    ParameterPicklistComponent
  ],
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true
    }
  ]
})
export class SelectInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() placeholder: string = 'Seleccione un tipo de certificado';
  @Input() disabled: boolean = false;
  @Input() certificateTypeId?: number;

  value: CertificateTypeEvent | null = null;
  certificateTypes$: Observable<CertificateType[]>;
  isLoading: boolean = true;
  private subscription: Subscription = new Subscription();
  
  private onChange: (value: CertificateTypeEvent | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private certificatesService: CertificatesService) {
    this.certificateTypes$ = this.certificatesService.certificateType;
  }

  ngOnInit(): void {
    // Suscribirse a los cambios para depuración y manejar el estado de carga
    this.subscription.add(
      this.certificateTypes$.pipe(
        finalize(() => this.isLoading = false)
      ).subscribe(types => {
        console.log('Certificate types loaded:', types);
        this.isLoading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSelectionChange(event: CertificateTypeEvent): void {
    this.value = event;
    this.onChange(event);
    this.onTouched();
  }

  writeValue(value: CertificateTypeEvent | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: CertificateTypeEvent | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
