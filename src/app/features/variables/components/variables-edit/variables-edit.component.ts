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
    selector: 'app-variables-edit',
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
    templateUrl: './variables-edit.component.html',
    styleUrls: ['./variables-edit.component.scss'],
})
export class VariablesEditComponent implements OnInit {
    variableForm: FormGroup;
    certificateTypes: CertificateType[] = [];
    variable: Variable | null = null;
    variableId: number | null = null;
    isSubmitting = false;
    private _destroyRef = inject(DestroyRef);

    constructor(
        private _formBuilder: FormBuilder,
        private _certificatesService: CertificatesService,
        private _variableService: VariablesService,
        private _notificationService: NotificationToastService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.variableForm = this._formBuilder.group({
            certificateTypeId: [{ value: null, disabled: false }, Validators.required], // Asegúrate de que no esté deshabilitado
            context: ['', Validators.required],
            sql: ['', Validators.required],
            list: [false, Validators.required],
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const variableId = params['id'];
            console.log("variableId", variableId);
            console.log(this.certificateTypes);

            if (variableId) {
                this.variableId = +variableId;
                this.loadVariable(variableId);
            }
        });
    }

    loadVariable(variableId: number): void {
        this._variableService.getVariableById(variableId).subscribe({
            next: (variable) => {
                if (variable) {
                    this.loadCertificateTypes(variable).subscribe(() => {
                    });

                }
            },
            error: (error) => {
                console.error('Error al cargar la variable:', error);
            }
        });
    }

    loadCertificateTypes(variable: Variable): Observable<CertificateType[]> {
        return this._certificatesService.certificateType.pipe(
            takeUntilDestroyed(this._destroyRef),
            tap((types) => {
                if (Array.isArray(types)) {
                    this.certificateTypes = types;

                    if (this.certificateTypes.length > 0) {
                        this.variableForm.patchValue({
                            certificateTypeId: variable.certificateType?.id,
                            context: variable.context,
                            sql: variable.sql?.replace(/"([^"]+)"/g, '[$1]') || '',
                            list: variable.list,
                        });
                        
                    }
                }
            })
        );
    }

    saveVariable(): void {
        if (this.variableForm.invalid) {
            this.variableForm.markAllAsTouched();
            this._notificationService.showError(
                'Por favor, verifique los campos obligatorios',
                'Error'
            );
            return;
        }

        this.isSubmitting = true;
        const formValue = this.variableForm.getRawValue();
        const variableData: Partial<Variable> = {
            context: formValue.context?.trim(),
            sql: formValue.sql?.trim().replace(/\[([^\]]+)\]/g, '"$1"'),
            list: formValue.list,
            certificateTypeId: formValue.certificateTypeId,
        };

        console.log("formValue", this.variableId);

        this._variableService.updateVariable(this.variableId!, variableData)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (response: Variable) => {
                    this._notificationService.showSuccess(
                        'Variable creada exitosamente',
                        'Éxito'
                    );
                    console.log('Variable creada:', response);
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
                    this.isSubmitting = false;
                    this.router.navigate(['/variables']);
                },
            });
    }

    returnVariable(): void {
        this.router.navigate(['/variables']);
    }
}
