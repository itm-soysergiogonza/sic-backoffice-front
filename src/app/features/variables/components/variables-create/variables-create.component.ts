import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NbInputModule, NbSelectModule, NbOptionModule, NbButtonModule, NbToggleModule, NbCardModule } from '@nebular/theme';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { CertificatesService } from '@shared/services/certificates.service';
import { VariablesService } from '@shared/services/variables.service';
import { NotificationToastService } from '@shared/services/notification-toast-service.service';
import { Variable } from '@shared/models/interfaces/variables.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Component({
    selector: 'app-variables-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NbInputModule,
        NbSelectModule,
        NbOptionModule,
        NbButtonModule,
        NbToggleModule,
        NbCardModule
    ],
    templateUrl: './variables-create.component.html',
    styleUrls: ['./variables-create.component.scss'],
})
export class VariablesCreateComponent implements OnInit {
     variableForm: FormGroup;
    
      public modalTitle = '';
      public isSubmitting = false;
      public certificateTypes: CertificateType[] = [];
      private _destroyRef = inject(DestroyRef);
      public isEditMode = false;
      public variableToEdit: Variable | null = null;
    
      constructor(
        private _formBuilder: FormBuilder,        
        private _variableService: VariablesService,
        private _certificatesService: CertificatesService,
        private _notificationService: NotificationToastService,
        private router: Router,
        private route: ActivatedRoute
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
            },
          });
    
        this._certificatesService.getCertificateTypes();
      }
    
      initialize(variable: Variable, isEdit: boolean = false): void {
        this.isEditMode = isEdit;
        this.modalTitle = isEdit ? 'Editar variable' : 'Crear variable';
    
        if (variable) {
          this.variableToEdit = { ...variable };
          this._initializeFormWithVariable();
        }
      }      
     
    
      private _buildVariableData(formValue: any): Partial<Variable> {
        let sqlProcessed = formValue.sql?.trim() || '';
        sqlProcessed = sqlProcessed.replace(/\[([^\]]+)\]/g, `"$1"`);
        const variableData: Partial<Variable> = {
            context: formValue.context?.trim(),
            sql: sqlProcessed,
            list: formValue.list,
            certificateTypeId: formValue.certificateTypeId,
          };
    
        return variableData;
      }
    
      private _isFormValid(): boolean {
        if (this.variableForm.invalid) {
          this.variableForm.markAllAsTouched();
          this._notificationService.showError(
            'Por favor, verifique los campos obligatorios',
            'Error'
          );
          return false;
        }
        return true;
      }
    
      private _initializeFormWithVariable(): void {
        if (!this.variableToEdit) {
          console.warn('No hay variable para editar');
          return;
        }
    
        const formValues = {
          certificateTypeId: this.variableToEdit.certificateTypeId || null,
          context: this.variableToEdit.context || '',
          sql: this.variableToEdit.sql || '',
          list: this.variableToEdit.list || false,
        };
    
        this.variableForm.patchValue(formValues);
      }
    
      public saveVariable(): void {
        if (!this._isFormValid()) {
          return;
        }
    
        this.isSubmitting = true;
        const formValue = this.variableForm.getRawValue();
        const variableData: Partial<Variable> = this._buildVariableData(formValue);
    
        if (this.isEditMode && this.variableToEdit?.id) {
          variableData.id = this.variableToEdit.id;
    
          this._variableService
            .updateVariable(this.variableToEdit.id, variableData)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
              next: (response: Variable) => {
                console.log('Variable actualizada exitosamente:', response);
                this._notificationService.showSuccess(
                  'Variable actualizada exitosamente',
                  'Éxito'
                );               
              },
              error: (error: Error) => {
                console.error('Error actualizando variable:', error);
                this._notificationService.showError(
                  'Error al actualizar la variable',
                  'Error'
                );
                this.isSubmitting = false;
              },
              complete: () => {
                this.isSubmitting = false;
              },
            });
        } else {
          this._variableService
            .createVariable(variableData)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
              next: (response: Variable) => {
                console.log('Nueva variable creada:', response);
                this._notificationService.showSuccess(
                  'Variable creada exitosamente',
                  'Éxito'
                );            
              },
              error: (error: Error) => {
                console.error('Error creando variable:', error);
                this._notificationService.showError(
                  'Error al crear la variable',
                  'Error'
                );
                this.isSubmitting = false;
              },
              complete: () => {
                this.router.navigate(['/variables']);
                this.isSubmitting = false;
              },
            });
        }
      }

      returnVariable(): void {
        this.router.navigate(['/variables']);
    }
}
