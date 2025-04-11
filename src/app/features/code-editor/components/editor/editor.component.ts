import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Parameters } from '@features/parameters/models/parameters.interface';
import { ParametersService } from '@features/parameters/services/parameters.service';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbAccordionModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbOptionModule,
  NbSelectModule,
} from '@nebular/theme';
import { CodeModel } from '@ngstack/code-editor';
import { CodeEditorModule } from '@ngstack/code-editor';
import { Observable } from 'rxjs';

type LanguageType = 'html' | 'css';

interface LanguageOption {
  value: LanguageType;
  label: string;
}

interface TemplateParameter {
  name: string;
  description: string;
  example: string;
  category: string;
}

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    CodeEditorModule,
    FormsModule,
    NbSelectModule,
    NbLayoutModule,
    NbOptionModule,
    NbCardModule,
    NbAccordionModule,
    NbIconModule,
    NbButtonModule,
    NbEvaIconsModule,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit {
  theme = 'vs-dark';
  selectedLanguage: LanguageType = 'html';
  htmlContent = '';
  cssContent = '';
  previewContent!: SafeHtml;
  showParameters = false;

  languages: LanguageOption[] = [
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
  ];

  defaultContent: Record<LanguageType, string> = {
    html: `<!DOCTYPE html>
<html>
<head>
  <title>Certificado de Constancia</title>
</head>
<body>
  <div class="certificate">
    <header class="header">
      <img src="{{institution.logo}}" alt="Logo ITM" class="logo">
      <div class="institution-info">
        <p>Identificada ante el DANE con el número {{institution.dane}}</p>
        <p>Registrada ante el ICFES con el código {{institution.icfes}}</p>
      </div>
    </header>

    <div class="department">
      <h2>DEPARTAMENTO DE ADMISIONES Y PROGRAMACIÓN ACADÉMICA</h2>
    </div>

    <div class="certifies">
      <p class="certifies-title">EL SUSCRITO JEFE DE OFICINA - DEPARTAMENTO DE ADMISIONES Y PROGRAMACIÓN</p>
      <p class="certifies-word">CERTIFICA</p>
    </div>

    <div class="content">
      <p>Que <strong>{{student.name}}</strong>, identificado con <strong>{{student.id}}</strong>
      de <strong>{{student.city}}</strong> y carné <strong>{{student.code}}</strong>, se matriculó para
      estudiar en esta institución durante el período académico <strong>{{certificate.period}}</strong> al nivel <strong>6</strong> del programa
      <strong>{{program.name}}</strong>, incorporado en el sistema interno del
      SNIES mediante Registro Nº <strong>{{program.snies}}</strong>, con una duración de <strong>{{program.duration}}</strong> semestres.</p>

      <p class="intensity">Intensidad semanal de {{program.intensity}} horas.</p>
    </div>

    <div class="note">
      <p>NOTA: Este certificado se expide a solicitud del interesado.</p>
    </div>

    <div class="signature-section">
      <p class="city-date">{{student.city}} {{certificate.date}}</p>
      <div class="signature-line"></div>
      <p class="signature-name">Juan Camilo Patiño Vanegas</p>
      <p class="signature-title">Jefe Dpto. de Admisiones y Programación Académica</p>
      <p class="signature-id">C.C. 8.060.849</p>
    </div>

    <footer class="footer">
      <div class="generated-info">
        <p>S.I.A (Registro Académico)</p>
        <p>Generado por: {{student.name}}</p>
        <p>{{certificate.date}}</p>
      </div>
      <div class="footer-logos">
        <img src="/assets/images/footer-logo.png" alt="Logo Alcaldía de Medellín" class="footer-logo">
      </div>
    </footer>
  </div>
</body>
</html>`,
    css: `/* Estilos del certificado */
.certificate {
  max-width: 800px;
  margin: 20px auto;
  padding: 40px;
  background-color: white;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  max-width: 300px;
  margin-bottom: 15px;
}

.institution-info {
  font-size: 14px;
  margin-bottom: 20px;
}

.department {
  text-align: center;
  margin: 30px 0;
}

.department h2 {
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  margin: 0;
}

.certifies {
  text-align: center;
  margin: 30px 0;
}

.certifies-title {
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.certifies-word {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0;
}

.content {
  text-align: justify;
  margin: 30px 0;
  padding: 0 20px;
}

.intensity {
  margin: 20px 0;
}

.note {
  margin: 30px 0;
  font-style: italic;
  font-size: 14px;
}

.signature-section {
  margin: 40px 0;
  text-align: left;
}

.city-date {
  margin-bottom: 40px;
}

.signature-line {
  width: 300px;
  border-bottom: 1px solid #000;
  margin: 10px 0;
}

.signature-name {
  margin: 5px 0;
  font-weight: bold;
}

.signature-title {
  margin: 5px 0;
  font-size: 14px;
}

.signature-id {
  margin: 5px 0;
  font-size: 14px;
}

.footer {
  margin-top: 50px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.generated-info {
  text-align: left;
}

.generated-info p {
  margin: 3px 0;
}

.footer-logos {
  text-align: right;
}

.footer-logo {
  max-width: 150px;
}`,
  };

  model: CodeModel = {
    language: 'html',
    uri: 'main.html',
    value: this.defaultContent.html,
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    automaticLayout: true,
  };

  // parameters$!: Observable<Parameters[]>;
  parameters: Parameters[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private _parametersService: ParametersService,
  ) {
    this.previewContent = this.sanitizer.bypassSecurityTrustHtml('');
  }

  ngOnInit() {
    this._parametersService.getParameters().subscribe({
      next: (data) => {
        this.parameters = data;
      },
      error: (err) => {
        console.error('Error loading parameters:', err);
      },
    });
    this.htmlContent = this.defaultContent.html;
    this.cssContent = this.defaultContent.css;
    this.updatePreview();
  }

  onLanguageChange(language: LanguageType): void {
    this.selectedLanguage = language;
    this.model = {
      language: language,
      uri: `main.${language}`,
      value: this.defaultContent[language],
    };
  }

  onCodeChanged(value: string): void {
    if (this.selectedLanguage === 'html') {
      this.htmlContent = value;
    } else {
      this.cssContent = value;
    }
    this.updatePreview();
  }

  toggleParameters(): void {
    this.showParameters = !this.showParameters;
  }

  insertParameter(paramName: string): void {
    if (this.selectedLanguage === 'html') {
      console.log('Insertar parámetro:', paramName);
    }
  }

  private updatePreview(): void {
    const combinedHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${this.cssContent}</style>
        </head>
        <body>${this.htmlContent}</body>
      </html>
    `;
    this.previewContent = this.sanitizer.bypassSecurityTrustHtml(combinedHtml);
  }
}
