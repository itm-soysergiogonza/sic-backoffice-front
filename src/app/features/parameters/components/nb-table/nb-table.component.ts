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
} from '@nebular/theme';
import { CertificateField } from '@shared/models/interfaces/certificate.interface';
import { ParameterService } from '@shared/services/parameter.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  defaultColumns = ['name', 'type', 'required', 'certificateType', 'actions'];
  allColumns = [this.customColumn, ...this.defaultColumns];

  dataSource: NbTreeGridDataSource<CertificateField>;
  parameters: CertificateField[] = [];

  private _destroyRef = inject(DestroyRef);

  sortColumn = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private _dataSourceBuilder: NbTreeGridDataSourceBuilder<CertificateField>,
    private _parametersService: ParameterService,
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

  getCertificateTypeName(row: any): string {
    return row.data.certificateType?.name || '-';
  }

  editParameter(parameter: CertificateField): void {
    // TODO: Implementar lógica para editar parámetro
    console.log('Edit parameter:', parameter);
    // Aquí deberías abrir un diálogo o navegar a un formulario de edición
  }

  deleteParameter(parameter: CertificateField): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el parámetro "${parameter.name}"?`)) {
      // TODO: Implementar lógica para eliminar parámetro
      console.log('Delete parameter:', parameter);
      // Aquí deberías llamar al servicio para eliminar el parámetro
    }
  }
}

