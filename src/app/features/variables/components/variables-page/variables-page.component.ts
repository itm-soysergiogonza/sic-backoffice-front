import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import {NbButtonModule, NbCardModule, NbDialogService, NbIconModule } from '@nebular/theme';
import { CreateVariableModalComponent } from '../create-variable-modal/create-variable-modal.component';
import { VariablesService } from '@shared/services/variables.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NbTableVariableComponent } from '../nb-table-variable/nb-table-variable.component';

@Component({
  selector: 'app-variables-page',
  imports: [NbCardModule, NbIconModule, NbButtonModule, NbTableVariableComponent],
  templateUrl: './variables-page.component.html',
  styleUrl: './variables-page.component.scss'
})
export class VariablesPageComponent {
  @ViewChild(NbTableVariableComponent) tableComponent!: NbTableVariableComponent;

  private _destroyRef = inject(DestroyRef);

  constructor(private _dialogService: NbDialogService,
              private _variableService: VariablesService,
              ) {}

  createVariable() {
    this._dialogService.open(CreateVariableModalComponent)
      .onClose.subscribe((data: any) => {
        if (data) {
          this._variableService.createVariable(data)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
              next: () => {
                this.tableComponent.refreshTable();
              },
              error: (error: Error) => {
                console.error('Error creating variable:', error);
              }
            });
        }
      });
  }
}
