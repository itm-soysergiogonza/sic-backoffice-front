import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Parameters } from '@features/parameters/models/parameters.interface';
import { ParametersService } from '@features/parameters/services/parameters.service';
import {
  NbCardModule,
  NbInputModule,
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbTreeGridModule,
} from '@nebular/theme';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

@Component({
  selector: 'nb-table',
  templateUrl: './nb-table.html',
  styleUrl: './nb-table.scss',
  imports: [NbCardModule, NbInputModule, NbTreeGridModule, NgForOf],
})
export class NbTableComponent implements OnInit {
  customColumn = 'name';
  defaultColumns = ['description', 'example', 'category'];
  allColumns = [this.customColumn, ...this.defaultColumns];

  dataSource: NbTreeGridDataSource<Parameters> =
    {} as NbTreeGridDataSource<Parameters>;
  parameters: Parameters[] = [];

  sortColumn = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<Parameters>,
    private parametersService: ParametersService,
  ) {}

  ngOnInit(): void {
    this.loadParameters();
  }

  loadParameters(): void {
    this.parametersService.getParameters().subscribe({
      next: (parameters) => {
        this.parameters = parameters;
        this.updateDataSource();
      },
      error: (error) => {
        console.error('Error loading parameters:', error);
      },
    });
  }

  updateDataSource(): void {
    const treeData: TreeNode<Parameters>[] = this.parameters.map((param) => ({
      data: param,
    }));

    this.dataSource = this.dataSourceBuilder.create(treeData);
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + nextColumnStep * index;
  }

  addParameter(): void {
    // TODO: Implementar lógica para agregar parámetro
    console.log('Add parameter clicked');
  }

  editParameter(parameter: Parameters): void {
    // TODO: Implementar lógica para editar parámetro
    console.log('Edit parameter:', parameter);
  }

  deleteParameter(parameter: Parameters): void {
    // TODO: Implementar lógica para eliminar parámetro
    console.log('Delete parameter:', parameter);
  }
}
