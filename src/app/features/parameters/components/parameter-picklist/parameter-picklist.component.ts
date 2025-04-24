import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PickListModule } from 'primeng/picklist';
import { CertificateField, CertificateType } from '@shared/models/interfaces/certificate.interface';
import { CertificatesService } from '@shared/services/certificates.service';
import { Observable, Subscription, catchError, finalize, of } from 'rxjs';
import { NbCardModule, NbToastrService, NbSpinnerModule } from '@nebular/theme';

@Component({
  selector: 'app-parameter-picklist',
  standalone: true,
  imports: [CommonModule, PickListModule, NbCardModule, NbSpinnerModule],
  template: `
    <nb-card>
      <nb-card-header>
        <div class="header-content">
          <span class="title">Configuración de Parámetros</span>
          <span class="subtitle" *ngIf="selectedCertificateType">
            {{ selectedCertificateType.name }}
          </span>
        </div>
      </nb-card-header>
      <nb-card-body>
        <div class="loading-container" *ngIf="isLoading">
          <nb-spinner status="primary"></nb-spinner>
          <span>Cargando parámetros...</span>
        </div>

        <p-pickList 
          *ngIf="!isLoading"
          [source]="availableParameters" 
          [target]="assignedParameters"
          [dragdrop]="true"
          [responsive]="true"
          [showSourceControls]="false"
          [showTargetControls]="false"
          sourceHeader="Parámetros Disponibles"
          targetHeader="Parámetros Asignados"
          [sourceStyle]="{ height: '30rem' }"
          [targetStyle]="{ height: '30rem' }"
          filterBy="label"
          sourceFilterPlaceholder="Buscar parámetro..."
          targetFilterPlaceholder="Buscar parámetro..."
          (onMoveToTarget)="onParameterAssigned($event)"
          (onMoveToSource)="onParameterUnassigned($event)">
          <ng-template let-parameter pTemplate="item">
            <div class="parameter-item">
              <div class="parameter-main">
                <span class="parameter-label">{{ parameter.label }}</span>
                <span class="parameter-type">{{ parameter.type }}</span>
              </div>
              <div class="parameter-details">
                <span class="parameter-required" *ngIf="parameter.required">Requerido</span>
                <span class="parameter-name">{{ parameter.name }}</span>
              </div>
            </div>
          </ng-template>
        </p-pickList>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./parameter-picklist.component.scss']
})
export class ParameterPicklistComponent implements OnInit, OnDestroy {
  @Input() selectedCertificateType?: CertificateType;

  availableParameters: CertificateField[] = [];
  assignedParameters: CertificateField[] = [];
  isLoading: boolean = false;
  private subscription = new Subscription();
  private allParameters: CertificateField[] = [];

  constructor(
    private certificatesService: CertificatesService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    if (this.selectedCertificateType) {
      this.loadAllParameters();
    }
  }

  loadAllParameters() {
    this.isLoading = true;
    this.subscription.add(
      this.certificatesService.getAllParameters()
        .pipe(
          catchError(error => {
            console.error('Error loading parameters:', error);
            this.toastrService.danger(
              'No se pudieron cargar los parámetros. Por favor, intente nuevamente.',
              'Error'
            );
            return of([]);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (parameters) => {
            this.allParameters = parameters;
            this.filterParameters();
          }
        })
    );
  }

  filterParameters() {
    if (this.selectedCertificateType && this.allParameters.length > 0) {
      this.assignedParameters = this.allParameters.filter(param => 
        param.certificateType.id === this.selectedCertificateType?.id
      );
      this.availableParameters = this.allParameters.filter(param => 
        param.certificateType.id !== this.selectedCertificateType?.id
      );
    }
  }

  onParameterAssigned(event: { items: CertificateField[] }) {
    try {
      event.items.forEach(parameter => {
        // Aquí iría la lógica para guardar en el backend
        this.toastrService.success(
          `Parámetro "${parameter.label}" asignado correctamente`,
          'Éxito'
        );
      });
    } catch (error) {
      console.error('Error assigning parameters:', error);
      this.toastrService.danger(
        'Error al asignar los parámetros',
        'Error'
      );
      // Revertir cambios en caso de error
      this.filterParameters();
    }
  }

  onParameterUnassigned(event: { items: CertificateField[] }) {
    try {
      event.items.forEach(parameter => {
        // Aquí iría la lógica para eliminar en el backend
        this.toastrService.info(
          `Parámetro "${parameter.label}" removido correctamente`,
          'Info'
        );
      });
    } catch (error) {
      console.error('Error unassigning parameters:', error);
      this.toastrService.danger(
        'Error al remover los parámetros',
        'Error'
      );
      // Revertir cambios en caso de error
      this.filterParameters();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
} 