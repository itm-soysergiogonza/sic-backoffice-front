import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { catchError, EMPTY } from 'rxjs';
import { NotificationToastService } from '@shared/services/notification-toast-service.service';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { VariableSqlModalComponent } from '@features/variables/components/variable-sql-modal/variable-sql-modal.component';
import { Router } from '@angular/router';



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
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class NbTableVariableComponent implements OnInit {
  customColumn = 'context';
  defaultColumns = ['variables', 'parametros', 'sql', 'actions'];
  allColumns = [this.customColumn, ...this.defaultColumns];

  dataSource: NbTreeGridDataSource<Variable>;
  variables: Variable[] = [];
  certificateTypes: CertificateType[] = [];
  selectedCertificateType: string = '';
  certificateType = new FormControl(0, [Validators.required]);
  public isLoadingCertificateTypes = false;

  private _destroyRef = inject(DestroyRef);

  sortColumn = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private _dataSourceBuilder: NbTreeGridDataSourceBuilder<Variable>,
    private _variableService: VariablesService,
    private _dialogService: NbDialogService,
    private _certificatesService: CertificatesService,
    private _notificationService: NotificationToastService,
    private router: Router,
  ) {
    this.dataSource = this._dataSourceBuilder.create([]);
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

  loadVariable(certificateTypeId: number) {
    this._variableService
      .getVariablesByCertificateType(certificateTypeId)
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
          this._notificationService.showError(
            'Error al cargar las variables',
            'Error'
          );
        },
      });
  }

  filterVariable(): void {
    let filteredVariables: Variable[] = [...this.variables];
    this.updateDataSource(filteredVariables);
  }

  updateDataSource(variable: Variable[]): void {
    const treeData: TreeNode<Variable>[] = variable.map((data: Variable) => ({
      data: data,
      expanded: false,
      children: [],
    }));

    this.dataSource.setData(treeData);
  }

  openSqlModal(sql: string): void {
    const dialogRef = this._dialogService.open(VariableSqlModalComponent, {
      closeOnBackdropClick: true,
      closeOnEsc: true,
      hasBackdrop: true,
    });

    setTimeout(() => {
      const modalComponent = dialogRef.componentRef?.instance;
      if (modalComponent) {
        modalComponent.sql = sql;
      }
    });
  }

  openVariableModal(variable: Variable): void {
    const dialogRef = this._dialogService.open(VariableSqlModalComponent, {
      closeOnBackdropClick: true,
      closeOnEsc: true,
      hasBackdrop: true,
    });
  
    setTimeout(() => {
      const modalComponent = dialogRef.componentRef?.instance;
      if (modalComponent) {
        // Convertimos la lista de strings en una lista de objetos con la propiedad nombre
        const listaVariables = Array.isArray(variable.variables)
          ? variable.variables.map(v => ({ nombre: v })) // Aquí cada elemento será un objeto { nombre: "valor" }
          : [];
    
        modalComponent.initialize(listaVariables, 'variables');
      }
    });
  } 

  openParametroModal(variable: Variable): void {
    const dialogRef = this._dialogService.open(VariableSqlModalComponent, {
      closeOnBackdropClick: true,
      closeOnEsc: true,
      hasBackdrop: true,
    });
  
    setTimeout(() => {
      const modalComponent = dialogRef.componentRef?.instance;
      if (modalComponent) {        
        const listaParametros = Array.isArray(variable.parameters)
          ? variable.parameters.map(v => ({ nombre: v })) 
          : [];
    
        modalComponent.initialize(listaParametros, 'parameters');
      }
    });    
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
      this._variableService
        .removeVariable(variable?.id)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            console.log('Variable eliminada:', variable);
            this._notificationService.showSuccess(
              'Variable eliminada exitosamente',
              'Éxito'
            );
            this.loadVariable(
              this.certificateType.value ? this.certificateType.value : 0
            );
          },
          error: (error) => {
            console.error('Error al eliminar la variable:', error);
            this._notificationService.showError(
              'Error al eliminar la variable',
              'Error'
            );
          },
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
  
    // Redirigir a la página de edición
    this.router.navigate(['/variables/edit'], { queryParams: { id: variable.id } });  }

  refreshTable(): void {
    this.loadVariable(
      this.certificateType.value ? this.certificateType.value : 0
    );
  }

  onCertificateTypeChange(value: number): void {
    this.loadVariable(value);
  }

  public isInvalid(): boolean {
    return this.certificateType.invalid;
  }
}
