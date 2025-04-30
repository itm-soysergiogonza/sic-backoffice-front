import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule,
  NbIconModule,
  NbInputModule,
  NbSearchModule,
  NbSearchService,
  NbCardModule,
  NbDialogService,
} from '@nebular/theme';
import { Subject, takeUntil } from 'rxjs';
import { CertificatesService } from '@shared/services/certificates.service';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';
import { NbTableTemplateComponent } from '../nb-table-template/nb-table-template.component';
import { TemplateModalComponent } from '../template-modal/template-modal.component';
import { Template } from '@shared/models/interfaces/template.interface';
import { NbTableComponent } from '@features/parameters/components/nb-table/nb-table.component';
import { TemplateService } from '@shared/services/template.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-page',
  imports: [
    CommonModule,
    FormsModule,
    NbIconModule,
    NbEvaIconsModule,
    NbButtonModule,
    NbInputModule,
    NbCardModule,
    NbSearchModule,
    NbTableTemplateComponent,
  ],
  templateUrl: './template-page.component.html',
  styleUrl: './template-page.component.scss',
})
export class TemplatePageComponent implements OnInit, OnDestroy {
  @ViewChild(NbTableTemplateComponent) nbTableComponent!: NbTableTemplateComponent;
  certificateTypes: CertificateType[] = [];
  filteredCertificates: CertificateType[] = [];
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _certificateService: CertificatesService,
    private _searchService: NbSearchService,
    private _dialogService: NbDialogService,
    private _templateService: TemplateService,
    public _router: Router
  ) {}

  ngOnInit(): void {
    this._certificateService.getCertificateTypes();
    // this._setupSearch();

    this._certificateService.certificateType
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (types: CertificateType[]) => {
          this.certificateTypes = types;
          this.filteredCertificates = types;
        },
        error: (error: Error) => {
          console.error('Error al cargar tipos de certificados:', error);
          this.certificateTypes = [];
          this.filteredCertificates = [];
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }


  private _filterCertificates(term: string): void {
    const searchTerm = term.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredCertificates = this.certificateTypes;
      return;
    }

    this.filteredCertificates = this.certificateTypes.filter(
      (certificate) =>
        certificate.name.toLowerCase().includes(searchTerm)
    );
  }

  createTemplate(): void {
    this._router.navigate([`plantillas/crear`]);
  }
}
