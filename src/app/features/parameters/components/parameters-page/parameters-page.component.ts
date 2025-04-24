import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
} from '@nebular/theme';
import { SelectInputComponent } from '@shared/components/select-input/select-input.component';

@Component({
  selector: 'app-parameters-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    NbTreeGridModule,
    NbIconModule,
    SelectInputComponent,
  ],
  templateUrl: './parameters-page.component.html',
  styleUrl: './parameters-page.component.scss',
})
export class ParametersPageComponent {}
