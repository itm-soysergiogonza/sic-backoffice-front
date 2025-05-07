
import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
import { EditorService, Template } from '../../services/editor.service';
import { VariablesService } from '@shared/services/variables.service';
import { Variable } from '@shared/models/interfaces/variables.interface';

type LanguageType = 'html' | 'css';

interface LanguageOption {
  value: LanguageType;
  label: string;
}

// interface TemplateParameter {
//   name: string;
//   description: string;
//   example: string;
//   category: string;
// }

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
  private _selectedLanguage: LanguageType = 'html';
  private _htmlContent = '';

  public previewContent!: SafeHtml;
  public showVariables = false;

  languages: LanguageOption[] = [
    { value: 'html', label: 'HTML' },
  ];

  model: CodeModel = {
    language: 'html',
    uri: 'index.html',
    value: '',
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: true,
    readOnly: false,
    automaticLayout: true,
  };

  constructor(
    private _sanitizer: DomSanitizer,
    private _editorService: EditorService,
    private _variablesService: VariablesService
  ) {
    this.previewContent = this._sanitizer.bypassSecurityTrustHtml('');
  }

  ngOnInit() {
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

    this._htmlContent = baseTemplate;
    this.model = {
      ...this.model,
      value: baseTemplate
    };
    this._updatePreview();
    this.contentChange.emit(baseTemplate);
  }

  loadTemplate() {
    if (this.templateId) {
      this._editorService.getTemplateById(this.templateId).subscribe({
        next: (template: Template) => {
          this._htmlContent = template.content;
          this.model = {
            ...this.model,
            value: template.content
          };
          this._updatePreview();
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

  onCodeChanged(value: string): void {
    this._htmlContent = value;
    this._updatePreview();
    this.contentChange.emit(this._htmlContent);
  }

  toggleVariables(): void {
    this.showVariables = !this.showVariables;
  }

  insertParameter(paramName: string): void {
    if (this._selectedLanguage === 'html') {
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

          this._htmlContent = editor.getValue();
          this._updatePreview();
          this.contentChange.emit(this._htmlContent);
        }
      }
    }
  }

  private _updatePreview(): void {
    const iframe = document.createElement('iframe');
    iframe.srcdoc = this._htmlContent;
    iframe.style.width = '100%';
    iframe.style.height = '100dvh';
    iframe.style.border = 'none';

    const previewContainer = document.querySelector('.preview-content');
    if (previewContainer) {
      previewContainer.innerHTML = '';
      previewContainer.appendChild(iframe);
    }
  }
}
