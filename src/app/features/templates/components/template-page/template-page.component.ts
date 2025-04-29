import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { CreateCertificateModalComponent } from '../create-certificate-modal/create-certificate-modal.component';
import { NbTableTemplateComponent } from '../nb-table-template/nb-table-template.component';

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
  certificateTypes: CertificateType[] = [];
  searchTerm = '';
  filteredCertificates: CertificateType[] = [];
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _certificateService: CertificatesService,
    private _searchService: NbSearchService,
    private _dialogService: NbDialogService,
  ) {}

  ngOnInit(): void {
    this._certificateService.getCertificateTypes();
    this._setupSearch();

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

  private _setupSearch(): void {
    this._searchService
      .onSearchInput()
      .pipe(takeUntil(this._destroy$))
      .subscribe(({ term }) => {
        this.searchTerm = term;
        this._filterCertificates(term);
      });

    this._searchService
      .onSearchSubmit()
      .pipe(takeUntil(this._destroy$))
      .subscribe(({ term }) => {
        this.searchTerm = term;
        this._filterCertificates(term);
      });
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

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredCertificates = this.certificateTypes;
  }

  createCertificate(): void {
    this._dialogService.open(CreateCertificateModalComponent)
      .onClose.subscribe(result => {
        if (result) {
          this._certificateService.createCertificateType(result)
            .pipe(takeUntil(this._destroy$))
            .subscribe({
              next: () => {
                this._certificateService.getCertificateTypes();
              },
              error: (error: Error) => {
                console.error('Error al crear el certificado:', error);
              }
            });
        }
      });
  }
}
