import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  RequiredValidator,
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
import {
  CertificateField,
  CertificateType,
} from '@shared/models/interfaces/certificate.interface';
import { ParameterService } from '@shared/services/parameter.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { ParameterModalComponent } from '../parameter-modal/parameter-modal.component';
import { CertificatesService } from '@shared/services/certificates.service';
import { FormUtils } from '@shared/utils/form-utils';

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
  imports: [
    NbCardModule,
    NbInputModule,
    NbTreeGridModule,
    NbButtonModule,
    NbIconModule,
    NbSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class NbTableComponent implements OnInit {
  customColumn = 'label';
  defaultColumns = [
    'name',
    'type',
    'required',
    'placeholder',
    'certificateType',
    'actions',
  ];
  allColumns = [this.customColumn, ...this.defaultColumns];
  certificateType = new FormControl(0, [Validators.required]);

  dataSource: NbTreeGridDataSource<CertificateField>;
  parameters: CertificateField[] = [];
  certificateTypes: CertificateType[] = [];

  private _destroyRef = inject(DestroyRef);
  public isLoadingCertificateTypes = false;

  sortColumn = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private _dataSourceBuilder: NbTreeGridDataSourceBuilder<CertificateField>,
    private _parametersService: ParameterService,
    private _dialogService: NbDialogService,
    private _certificatesService: CertificatesService
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

  loadParameters(certificateTypeId: number) {
    this._parametersService
      .getParametersByCertificateType(certificateTypeId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (parameters: CertificateField[]) => {
          if (Array.isArray(parameters)) {
            this.parameters = parameters;
            this.filterParameters();
          } else {
            console.error('Received invalid parameters data:', parameters);
          }
        },
        error: (error: Error) => {
          console.error('Error loading parameters:', error);
        },
      });
  }

  filterParameters(): void {
    let filteredParameters = [...this.parameters];
    this.updateDataSource(filteredParameters);
  }

  onCertificateTypeChange(value: number): void {
    this.loadParameters(value);
  }

  updateDataSource(parameters: CertificateField[]): void {
    const treeData: TreeNode<CertificateField>[] = parameters.map((param) => ({
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

  getCertificateTypeName(row: TreeNode<CertificateField>): string {
    return row.data.certificateType?.name || '-';
  }

  deleteParameter(parameter: CertificateField): void {
    if (confirm('¿Está seguro que desea eliminar este parámetro?')) {
      this._parametersService
        .removeParameter(parameter.id)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this.loadParameters(
              this.certificateType.value ? this.certificateType.value : 0
            );
          },
          error: (error) => {
            console.error('Error deleting parameter:', error);
          },
        });
    }
  }

  editParameter(parameter: CertificateField): void {
    if (!parameter) {
      console.warn('No se recibió parámetro para editar');
      return;
    }

    if (!parameter.id) {
      console.warn('El parámetro no tiene ID:', parameter);
      return;
    }

    const dialogRef = this._dialogService.open(ParameterModalComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: true,
      hasScroll: false,
    });

    setTimeout(() => {
      const modalComponent = dialogRef.componentRef?.instance;
      if (modalComponent) {
        modalComponent.initialize(parameter, true);
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
          this.loadParameters(
            this.certificateType.value ? this.certificateType.value : 0
          );
        }
      });
  }
  public isInvalid(): boolean {
    return this.certificateType.invalid;
  }
}
