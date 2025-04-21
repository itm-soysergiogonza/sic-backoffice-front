import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
} from '@nebular/theme';
import { NbTableComponent } from '../../../../../shared/components/nb-table/nb-table';

@Component({
  selector: 'app-parameters-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NbCardModule,
    NbInputModule,
    NbTreeGridModule,
    NbIconModule,
    NbTableComponent,
  ],
  templateUrl: './parameters-page.component.html',
  styleUrl: './parameters-page.component.scss',
})
export class ParametersPageComponent {}
