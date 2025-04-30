import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ParameterModalComponent } from '@features/parameters/components/parameter-modal/parameter-modal.component';
import {
  NbCardModule,
  NbInputModule,
  NbTreeGridModule,
  NbButtonModule,
  NbIconModule,
  NbSelectModule,
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbDialogService,
} from '@nebular/theme';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { CertificatesService } from '@shared/services/certificates.service';
import { catchError, EMPTY } from 'rxjs';
import { TypesModalComponent } from '../types-modal/types-modal.component';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

@Component({
  selector: 'app-types-list',
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
  templateUrl: './types-list.component.html',
  styleUrl: './types-list.component.scss',
})
export class TypesListComponent {
  nameColumn = 'name';
  paidColumn = 'paid';
  priceColumn = 'price';
  defaultColumns = ['actions'];
  allColumns = [
    this.nameColumn,
    this.paidColumn,
    this.priceColumn,
    ...this.defaultColumns,
  ];

  dataSource: NbTreeGridDataSource<CertificateType>;
  certificateTypes: CertificateType[] = [];

  public isLoadingCertificateTypes = false;

  private _destroyRef = inject(DestroyRef);

  sortColumn = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private _dataSourceBuilder: NbTreeGridDataSourceBuilder<CertificateType>,
    private _router: Router,
    private _certificatesService: CertificatesService,
    private _dialogService: NbDialogService
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
          if (Array.isArray(types)) {
            this.certificateTypes = types;
            this.filterTypes();
          }
        },
        error: (error) => {
          console.error('Error al cargar los tipos de certificados:', error);
        },
      });

    this._certificatesService.getCertificateTypes();
  }

  filterTypes(): void {
    let filteredTypes: CertificateType[] = [...this.certificateTypes];
    this.updateDataSource(filteredTypes);
  }

  updateDataSource(parameters: CertificateType[]): void {
    const treeData: TreeNode<CertificateType>[] = parameters.map((param) => ({
      data: param,
      expanded: false,
      children: [],
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

  deleteType(type: CertificateType): void {
    if (confirm('¿Está seguro de que desea eliminar este tipo?')) {
      this._certificatesService
        .deleteCertificateType(type.id)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this.loadCertificateTypes();
          },
          error: (error) => {
            console.error('Error al eliminar el tipo certificado:', error);
          },
        });
    }
  }

  editType(type: CertificateType): void {
    if (!type) {
      console.warn('No se recibió tipo certificado para editar');
      return;
    }

    if (!type.id) {
      console.warn('El tipo certificado no tiene ID:', type);
      return;
    }

    const dialogRef = this._dialogService.open(TypesModalComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: true,
      hasScroll: false,
    });

    setTimeout(() => {
      const modalComponent = dialogRef.componentRef?.instance;
      if (modalComponent) {
        modalComponent.initialize(type, true);
      }
    });

    dialogRef.onClose
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        catchError((error) => {
          console.error('Error al abrir el modal de edición:', error);
          return EMPTY;
        })
      )
      .subscribe((result) => {
        if (result) {
          this.loadCertificateTypes();
        }
      });
  }

  refreshTable(): void {
    this.loadCertificateTypes();
  }
}
