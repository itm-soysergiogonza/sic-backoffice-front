import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '@features/certifications/services/certificate.service';
import { NbButtonModule, NbIconModule } from '@nebular/theme';
import { Certificate } from '../../models/certificate.model';

@Component({
  selector: 'app-certification-details',
  imports: [NbButtonModule, NbIconModule],
  templateUrl: './certification-details.component.html',
  styleUrl: './certification-details.component.scss',
})
export class CertificationDetailsComponent implements OnInit {
  certificate?: Certificate;
  loading = false;
  error = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _certificateService: CertificateService,
  ) {}

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');

    if (id) {
      this.loading = true;
      this._certificateService.getCertificateById(id).subscribe({
        next: (certificate) => {
          this.certificate = certificate;
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        },
      });
    } else {
      this.error = true;
    }
    console.log('Certificate ID:', id);
  }

  onEdit() {
    if (this.certificate) {
      this._router.navigate([`/certificados/${this.certificate.id}/editar`]);
    }
  }
}
