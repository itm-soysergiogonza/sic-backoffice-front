import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule,
  NbDialogService,
  NbIconModule,
  NbInputModule,
} from '@nebular/theme';
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
  ],
  templateUrl: './certification-page.component.html',
  styleUrl: './certification-page.component.scss',
})
export class CertificationPageComponent implements OnInit {
  certificates: Certificate[] = [];
  filteredCertificates: Certificate[] = [];
  searchTerm = '';

  constructor(
    private _certificateService: CertificateService,
    private _dialogService: NbDialogService,
  ) {}

  ngOnInit(): void {
    this._loadCertificates();
  }

  private _loadCertificates(): void {
    this._certificateService.getCertificateList().subscribe((certificates) => {
      this.certificates = certificates;
      this.filteredCertificates = certificates;
    });
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value
      .toLowerCase()
      .trim();
    this.searchTerm = searchTerm;

    if (!searchTerm) {
      this.filteredCertificates = this.certificates;
      return;
    }

    this.filteredCertificates = this.certificates.filter(
      (cert) =>
        cert.name.toLowerCase().includes(searchTerm) ||
        cert.purpose.toLowerCase().includes(searchTerm) ||
        cert.category.toLowerCase().includes(searchTerm),
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredCertificates = this.certificates;
  }

  /* createCertificate(): void {
    this._dialogService
      .open(CreateCertificateModalComponent)
      .onClose.subscribe((result) => {
        if (result) {
          this._certificateService
            .getCertificates(result)
            .subscribe((newCertificate) => {
              this.certificates = [...this.certificates, newCertificate];
              this.filteredCertificates = [
                ...this.filteredCertificates,
                newCertificate,
              ];
            });
        }
      });
  }*/
}
