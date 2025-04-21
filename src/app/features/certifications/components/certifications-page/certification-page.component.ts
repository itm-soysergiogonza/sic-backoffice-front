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
} from '@nebular/theme';
import { Subject, takeUntil } from 'rxjs';
import { Certificate } from '../../models/certificate.model';
import { CertificateService } from '../../services/certificate.service';
import { CertificationCardComponent } from '../certification-card/certification-card.component';

@Component({
  selector: 'app-certification-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NbIconModule,
    NbEvaIconsModule,
    NbButtonModule,
    NbInputModule,
    CertificationCardComponent,
    NbSearchModule,
  ],
  templateUrl: './certification-page.component.html',
  styleUrl: './certification-page.component.scss',
})
export class CertificationPageComponent implements OnInit, OnDestroy {
  certificates: Certificate[] = [];
  searchTerm = '';
  filteredCertificates: Certificate[] = [];
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _certificateService: CertificateService,
    private _searchService: NbSearchService,
  ) {}

  ngOnInit(): void {
    this._loadCertificates();
    this._setupSearch();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _loadCertificates(): void {
    this._certificateService
      .getCertificateList()
      .subscribe((certificates: Certificate[]) => {
        this.certificates = certificates;
        this.filteredCertificates = certificates;
      });
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
      this.filteredCertificates = this.certificates;
      return;
    }

    this.filteredCertificates = this.certificates.filter(
      (certificate) =>
        certificate.name.toLowerCase().includes(searchTerm) ||
        certificate.purpose.toLowerCase().includes(searchTerm) ||
        certificate.category.toLowerCase().includes(searchTerm),
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredCertificates = this.certificates;
  }
}
