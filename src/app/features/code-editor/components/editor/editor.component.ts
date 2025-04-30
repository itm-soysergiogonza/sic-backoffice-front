import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ParameterService } from '@shared/services/parameter.service';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbAccordionModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbOptionModule,
  NbSelectModule,
  NbTooltipModule,
} from '@nebular/theme';
import { CodeModel } from '@ngstack/code-editor';
import { CodeEditorModule, CodeEditorComponent } from '@ngstack/code-editor';
import * as monaco from 'monaco-editor';
import { Parameter } from '@shared/models/interfaces/parameter.interface';
import { EditorService, Template } from '../../services/editor.service';
import { VariablesService } from '@shared/services/variables.service';
import { Variable } from '@shared/models/interfaces/variables.interface';

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
    NbTooltipModule,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit {
  @Input() templateId?: number;
  @Input() certificateTypeId?: number;
  @Input() variables: Variable[] = [];
  @Output() contentChange = new EventEmitter<string>();
  @ViewChild('editor') editor!: CodeEditorComponent;

  theme = 'vs-dark';
  selectedLanguage: LanguageType = 'html';
  htmlContent = '';
  cssContent = '';
  previewContent!: SafeHtml;
  showVariables = false;

  languages: LanguageOption[] = [
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
  ];

  model: CodeModel = {
    language: 'html',
    uri: 'main.html',
    value: '',
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

  constructor(
    private sanitizer: DomSanitizer,
    private _parametersService: ParameterService,
    private _editorService: EditorService,
    private _variablesService: VariablesService
  ) {
    this.previewContent = this.sanitizer.bypassSecurityTrustHtml('');
  }

  ngOnInit() {
    console.log('Certificate Type ID:', this.certificateTypeId);
    if (this.templateId) {
      this.loadTemplate();
    } else {
      this.loadBaseTemplate();
    }

    if (this.certificateTypeId) {
      this.loadVariables();
    }
  }

  loadBaseTemplate() {
    const baseTemplate = `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
      <title>Document</title>
   </head>
   <body>

   </body>
  </html>`;

    this.htmlContent = baseTemplate;
    this.model = {
      ...this.model,
      value: baseTemplate
    };
    this.updatePreview();
    this.contentChange.emit(baseTemplate);
  }

  loadTemplate() {
    if (this.templateId) {
      this._editorService.getTemplateById(this.templateId).subscribe({
        next: (template: Template) => {
          this.htmlContent = template.content;
          this.model = {
            ...this.model,
            value: template.content
          };
          this.updatePreview();
          this.contentChange.emit(template.content);
        },
        error: (error) => {
          console.error('Error loading template:', error);
        }
      });
    }
  }

  defaultVariables: string[] = [
    "qrcodeBlock",
    "qrcodeBlock",
    "certCode",
    "electronicSign",
    "verificationLink"
  ]

  loadVariables() {
    if (this.certificateTypeId) {
      this._variablesService.getVariablesByCertificateType(this.certificateTypeId).subscribe({
        next: (variables) => {
          this.variables = variables;
        },
        error: (error) => {
          console.error('Error loading parameters:', error);
        }
      });
    }
  }

  onLanguageChange(language: LanguageType): void {
    this.selectedLanguage = language;
    this.model = {
      ...this.model,
      language,
      uri: `main.${language}`,
      value: language === 'html' ? this.htmlContent : this.cssContent,
    };
  }

  onCodeChanged(value: string): void {
    if (this.selectedLanguage === 'html') {
      this.htmlContent = value;
    } else {
      this.cssContent = value;
    }
    this.updatePreview();
    this.contentChange.emit(this.htmlContent);
  }

  toggleVariables(): void {
    this.showVariables = !this.showVariables;
    console.log('Parameters visibility:', this.showVariables);
    console.log('Current variable:', this.variables);
  }

  insertParameter(paramName: string): void {
    if (this.selectedLanguage === 'html') {
      const editor = this.editor.editor;
      if (editor) {
        const position = editor.getPosition();
        if (position) {
          const range = new monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
          );

          const parameterTag = `\${${paramName}}`;
          editor.executeEdits('insert-parameter', [
            {
              range,
              text: parameterTag,
              forceMoveMarkers: true
            }
          ]);

          this.htmlContent = editor.getValue();
          this.updatePreview();
          this.contentChange.emit(this.htmlContent);
        }
      }
    }
  }

  private updatePreview(): void {
    const combinedContent = `
      <style>${this.cssContent}</style>
      ${this.htmlContent}
    `;
    this.previewContent = this.sanitizer.bypassSecurityTrustHtml(combinedContent);
  }
}
