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
import { CertificateField, CertificateType } from '@shared/models/interfaces/certificate.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CertificatesService } from '@shared/services/certificates.service';
import { TemplateService } from '@shared/services/template.service';
import { Template } from '@shared/models/interfaces/template.interface';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

@Component({
  selector: 'app-nb-table-template',
  templateUrl: './nb-table-template.component.html',
  styleUrl: './nb-table-template.component.scss',
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
export class NbTableTemplateComponent implements OnInit {
  customColumn = 'name';
  defaultColumns = ['content', 'actions'];
  allColumns = [this.customColumn, ...this.defaultColumns];

  dataSource: NbTreeGridDataSource<Template>;
  templates: Template[] = [];
  certificateTypes: CertificateType[] = [];
  selectedCertificateType: string = '';

  private _destroyRef = inject(DestroyRef);

  sortColumn = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private _dataSourceBuilder: NbTreeGridDataSourceBuilder<Template>,
    private _templatesService: TemplateService,
    private _dialogService: NbDialogService,
    private _certificatesService: CertificatesService,
  ) {
    this.dataSource = this._dataSourceBuilder.create([]);
  }

  ngOnInit(): void {
    // this.loadCertificateTypes();
    this.loadTemplates();
  }

  /*loadCertificateTypes(): void {
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
  }*/

  loadTemplates() {
    this._templatesService.getTemplates()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (templates: Template[]) => {
          if (Array.isArray(templates)) {
            this.templates = templates;
            this.filterTemplates();
          }
        },
        error: (error: Error) => {
          console.error('Error loading parameters:', error);
        },
      })
  }

  filterTemplates(): void {
    let filteredTemplates: Template[]= [...this.templates];
    this.updateDataSource(filteredTemplates);
    console.log('Plantillas filtradas:', filteredTemplates);
  }

  /*onCertificateTypeChange(value: string): void {
    console.log('Tipo de certificado seleccionado:', value);
    this.selectedCertificateType = value;
    this.filterParameters();
  }*/

  updateDataSource(parameters: Template[]): void {
    const treeData: TreeNode<Template>[] = parameters.map((param) => ({
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

  /*getCertificateTypeName(row: TreeNode<Template>): string {
    return row.data.certificateType?.name || '-';
  }*/

  deleteTemplate(template: Template): void {
    if (confirm('¿Está seguro de que desea eliminar esta plantilla?')) {
      this._templatesService.removeTemplate(template.id)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            console.log('Plantilla eliminada:', template);
            this.loadTemplates();
          },
          error: (error) => {
            console.error('Error al eliminar la plantilla:', error);
          }
        });
    }
  }

  editParameter(parameter: CertificateField): void {
    /*  if (!parameter) {
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
          catchError(error => {
            console.error('Error al abrir el modal de edición:', error);
            return EMPTY;
          })
        )
        .subscribe((result) => {
          if (result) {
            this.loadParameters();
          }
        });
    }*/
  }
}
