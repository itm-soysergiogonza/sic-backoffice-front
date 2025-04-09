import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbIconModule, NbButtonModule, NbInputModule, NbDialogService } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { CertificationCardComponent } from '../certification-card/certification-card.component';
import { CreateCertificateModalComponent } from '../create-certificate-modal/create-certificate-modal.component';
import { Certificate } from '../../models/certificate.model';
import { CertificateService } from '../../services/certificate.service';

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
  styleUrl: './certification-page.component.scss'
})
export class CertificationPageComponent implements OnInit {
  certificates: Certificate[] = [];
  filteredCertificates: Certificate[] = [];
  searchTerm: string = '';

  constructor(
    private certificateService: CertificateService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.loadCertificates();
  }

  private loadCertificates(): void {
    this.certificateService.getCertificates().subscribe(
      certificates => {
        this.certificates = certificates;
        this.filteredCertificates = certificates;
      }
    );
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.searchTerm = searchTerm;

    if (!searchTerm) {
      this.filteredCertificates = this.certificates;
      return;
    }

    this.filteredCertificates = this.certificates.filter(cert =>
      cert.name.toLowerCase().includes(searchTerm) ||
      cert.purpose.toLowerCase().includes(searchTerm) ||
      cert.category.toLowerCase().includes(searchTerm)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredCertificates = this.certificates;
  }

  createCertificate(): void {
    this.dialogService.open(CreateCertificateModalComponent)
      .onClose.subscribe(result => {
        if (result) {
          this.certificateService.createCertificate(result).subscribe(
            newCertificate => {
              this.certificates = [...this.certificates, newCertificate];
              this.filteredCertificates = [...this.filteredCertificates, newCertificate];
            }
          );
        }
      });
  }
}
