import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CertificateTypeEvent, CertificateType } from '@shared/models/interfaces/certificate.interface';
import { 
  NbSelectModule, 
  NbSpinnerModule, 
  NbIconModule,
  NbCardModule,
  NbListModule,
  NbButtonModule
} from '@nebular/theme';
import { CertificatesService } from '@shared/services/certificates.service';
import { Observable, Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [
    CommonModule, 
    NbSelectModule, 
    NbSpinnerModule,
    NbIconModule,
    NbCardModule,
    NbListModule,
    NbButtonModule,
    ReactiveFormsModule, 
    FormsModule
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

  certificateTypes$: Observable<CertificateType[]>;
  selectedTypes: CertificateType[] = [];
  sourceSelected: CertificateType | null = null;
  targetSelected: CertificateType | null = null;
  isLoading: boolean = true;
  
  private subscription: Subscription = new Subscription();
  private onChange: (value: CertificateType[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private certificatesService: CertificatesService) {
    this.certificateTypes$ = this.certificatesService.certificateType;
  }

  ngOnInit(): void {
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

  // PickList Methods
  selectSourceItem(item: CertificateType): void {
    this.sourceSelected = this.sourceSelected === item ? null : item;
    this.targetSelected = null;
  }

  selectTargetItem(item: CertificateType): void {
    this.targetSelected = this.targetSelected === item ? null : item;
    this.sourceSelected = null;
  }

  moveToTarget(): void {
    if (this.sourceSelected) {
      this.selectedTypes.push(this.sourceSelected);
      this.sourceSelected = null;
      this.onChange(this.selectedTypes);
      this.onTouched();
    }
  }

  moveToSource(): void {
    if (this.targetSelected) {
      this.selectedTypes = this.selectedTypes.filter(item => item !== this.targetSelected);
      this.targetSelected = null;
      this.onChange(this.selectedTypes);
      this.onTouched();
    }
  }

  isSelectedInSource(item: CertificateType): boolean {
    return this.sourceSelected === item;
  }

  isSelectedInTarget(item: CertificateType): boolean {
    return this.targetSelected === item;
  }

  get hasSelectedSource(): boolean {
    return !!this.sourceSelected;
  }

  get hasSelectedTarget(): boolean {
    return !!this.targetSelected;
  }

  // ControlValueAccessor Implementation
  writeValue(value: CertificateType[]): void {
    this.selectedTypes = value || [];
  }

  registerOnChange(fn: (value: CertificateType[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
