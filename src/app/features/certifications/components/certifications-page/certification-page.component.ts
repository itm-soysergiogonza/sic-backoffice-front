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
} from '@nebular/theme';
import { Subject, takeUntil } from 'rxjs';
import { CertificationCardComponent } from '../certification-card/certification-card.component';
import { CertificatesService } from '@shared/services/certificates.service';
import { CertificateType } from '@shared/models/interfaces/certificate.interface';

@Component({
  selector: 'app-certification-page',
  imports: [
    CommonModule,
    FormsModule,
    NbIconModule,
    NbEvaIconsModule,
    NbButtonModule,
    NbInputModule,
    NbCardModule,
    CertificationCardComponent,
    NbSearchModule,
  ],
  templateUrl: './certification-page.component.html',
  styleUrl: './certification-page.component.scss',
})
export class CertificationPageComponent implements OnInit, OnDestroy {
  certificateTypes: CertificateType[] = [];
  searchTerm = '';
  filteredCertificates: CertificateType[] = [];
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _certificateService: CertificatesService,
    private _searchService: NbSearchService,
  ) {}

  ngOnInit(): void {
    this._certificateService.getCertificateTypes();
    this._setupSearch();

    this._certificateService.certificateType
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (types) => {
          this.certificateTypes = types;
          this.filteredCertificates = types;
        },
        error: (error) => {
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
    console.log('Create new certificate');
  }
}
