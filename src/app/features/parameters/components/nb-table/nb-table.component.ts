import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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
} from '@nebular/theme';
import { CertificateField } from '@shared/models/interfaces/certificate.interface';
import { ParameterService } from '@shared/services/parameter.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { ParameterModalComponent } from '../parameter-modal/parameter-modal.component';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

@Component({
  selector: 'app-nb-table',
  templateUrl: './nb-table.component.html',
  styleUrl: './nb-table.component.scss',
  standalone: true,
  imports: [NbCardModule, NbInputModule, NbTreeGridModule, NbButtonModule, NbIconModule]
})
export class NbTableComponent implements OnInit {
  customColumn = 'label';
  defaultColumns = ['name', 'type', 'required', 'placeholder', 'certificateType', 'actions'];
  allColumns = [this.customColumn, ...this.defaultColumns];

  dataSource: NbTreeGridDataSource<CertificateField>;
  parameters: CertificateField[] = [];

  private _destroyRef = inject(DestroyRef);

  sortColumn = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private _dataSourceBuilder: NbTreeGridDataSourceBuilder<CertificateField>,
    private _parametersService: ParameterService,
    private _dialogService: NbDialogService,
  ) {
    this.dataSource = this._dataSourceBuilder.create([]);
  }

  ngOnInit(): void {
    this.loadParameters();
  }

  loadParameters() {
    this._parametersService.getParameters()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (parameters: CertificateField[]) => {
          if (Array.isArray(parameters)) {
            this.parameters = parameters;
            this.updateDataSource(this.parameters);
          } else {
            console.error('Received invalid parameters data:', parameters);
          }
        },
        error: (error: Error) => {
          console.error('Error loading parameters:', error);
        },
      })
  }

  updateDataSource(parameters: CertificateField[]): void {
    const treeData: TreeNode<CertificateField>[] = parameters.map((param) => ({
      data: param,
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

  getCertificateTypeName(row: TreeNode<CertificateField>): string {
    return row.data.certificateType?.name || '-';
  }

  deleteParameter(parameter: CertificateField): void {
    if (confirm('¿Está seguro que desea eliminar este parámetro?')) {
      this._parametersService.removeParameter(parameter.id)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this.loadParameters();
          },
          error: (error) => {
            console.error('Error deleting parameter:', error);
          }
        });
    }
  }

  editParameter(parameter: CertificateField): void {
    console.log('1. Botón editar clickeado. Datos del parámetro:', parameter);

    if (!parameter) {
      console.warn('No se recibió parámetro para editar');
      return;
    }

    if (!parameter.id) {
      console.warn('El parámetro no tiene ID:', parameter);
      return;
    }

    console.log('2. Abriendo modal con datos:', parameter);

    const dialogRef = this._dialogService.open(ParameterModalComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: true,
      hasScroll: false,
    });

    // Inicializar el modal después de que se haya creado
    setTimeout(() => {
      const modalComponent = dialogRef.componentRef?.instance;
      if (modalComponent) {
        console.log('3. Inicializando modal');
        modalComponent.initialize(parameter, true);
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
        console.log('4. Modal cerrado con resultado:', result);
        if (result) {
          console.log('5. Actualizando tabla con nuevos datos');
          this.loadParameters();
        }
      });
  }
}

