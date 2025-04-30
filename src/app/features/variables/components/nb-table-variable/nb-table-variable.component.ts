import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NbCardModule,
  NbInputModule,
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbTreeGridModule,
  NbButtonModule,
  NbIconModule,
  NbDialogService,
  NbSelectModule,
} from '@nebular/theme';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CertificatesService } from '@shared/services/certificates.service';
import { Variable } from '@shared/models/interfaces/variables.interface';
import { VariablesService } from '@shared/services/variables.service';
import {catchError, EMPTY } from 'rxjs';
import { VariableModalComponent } from '../variable-modal/variable-modal.component';
import { NotificationToastService } from '@shared/services/notification-toast-service.service';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

@Component({
  selector: 'app-nb-table-variable',
  templateUrl: './nb-table-variable.component.html',
  styleUrl: './nb-table-variable.component.scss',
  standalone: true,
  imports: [
    NbCardModule,
    NbInputModule,
    NbTreeGridModule,
    NbButtonModule,
    NbIconModule,
    NbSelectModule,
    FormsModule
  ]
})
export class NbTableVariableComponent implements OnInit {
  customColumn = 'context';
  defaultColumns = ['sql', 'actions'];
  allColumns = [this.customColumn, ...this.defaultColumns];

  dataSource: NbTreeGridDataSource<Variable>;
  variables: Variable[] = [];
  certificateTypes: Variable[] = [];
  selectedCertificateType: string = '';

  private _destroyRef = inject(DestroyRef);

  sortColumn = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private _dataSourceBuilder: NbTreeGridDataSourceBuilder<Variable>,
    private _variableService: VariablesService,
    private _dialogService: NbDialogService,
    private _certificatesService: CertificatesService,
    private _notificationService: NotificationToastService
  ) {
    this.dataSource = this._dataSourceBuilder.create([]);
  }

  ngOnInit(): void {
    this.loadCertificateTypes();
    this.loadVariable();
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
        }
      });

    this._certificatesService.getCertificateTypes();
  }

  loadVariable() {
    this._variableService.getVariables()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (variables: Variable[]) => {
          if (Array.isArray(variables)) {
            this.variables = variables;
            this.filterVariable();
          }
        },
        error: (error: Error) => {
          console.error('Error loading variables:', error);
          this._notificationService.showError('Error al cargar las variables', 'Error');
        },
      })
  }

  filterVariable(): void {
    let filteredVariables: Variable[]= [...this.variables];
    this.updateDataSource(filteredVariables);
  }

  /*onCertificateTypeChange(value: string): void {
    console.log('Tipo de certificado seleccionado:', value);
    this.selectedCertificateType = value;
    this.filterParameters();
  }*/

  updateDataSource(variable: Variable[]): void {
    const treeData: TreeNode<Variable>[] = variable.map((data: Variable) => ({
      data: data,
      expanded: false,
      children: []
    }));

    this.dataSource.setData(treeData);
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 100;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + nextColumnStep * index;
  }

  /*getCertificateTypeName(row: TreeNode<Template>): string {
    return row.data.certificateType?.name || '-';
  }*/

  deleteVariable(variable: Variable): void {
    if (confirm('¿Está seguro de que desea eliminar esta variable?')) {
      this._variableService.removeVariable(variable?.id)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            console.log('Variable eliminada:', variable);
            this._notificationService.showSuccess('Variable eliminada exitosamente', 'Éxito');
            this.loadVariable();
          },
          error: (error) => {
            console.error('Error al eliminar la variable:', error);
            this._notificationService.showError('Error al eliminar la variable', 'Error');
          }
        });
    }
  }

  editVariable(variable: Variable): void {
      if (!variable) {
        console.warn('No se recibió variable para editar');
        return;
      }

      if (!variable.id) {
        console.warn('La variable no tiene ID:', variable);
        return;
      }

      const dialogRef = this._dialogService.open(VariableModalComponent, {
        closeOnBackdropClick: false,
        closeOnEsc: true,
        hasBackdrop: true,
        hasScroll: false,
      });

      setTimeout(() => {
        const modalComponent = dialogRef.componentRef?.instance;
        if (modalComponent) {
          modalComponent.initialize(variable, true);
        }
      });

      dialogRef.onClose
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          catchError(error => {
            console.error('Error al abrir el modal de edición:', error);
            return EMPTY;
          })
        )
        .subscribe((result) => {
          if (result) {
            this.loadVariable();
          }
        });
    }
  refreshTable(): void {
    this.loadVariable();
  }
}
