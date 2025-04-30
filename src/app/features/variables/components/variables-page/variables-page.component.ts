import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import {NbButtonModule, NbCardModule, NbDialogService, NbIconModule } from '@nebular/theme';
import { VariablesService } from '@shared/services/variables.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NbTableVariableComponent } from '../nb-table-variable/nb-table-variable.component';
import { VariableModalComponent } from '../variable-modal/variable-modal.component';
import { NotificationToastService } from '@shared/services/notification-toast-service.service';
import { Variable } from '@shared/models/interfaces/variables.interface';

@Component({
  selector: 'app-variables-page',
  imports: [NbCardModule, NbIconModule, NbButtonModule, NbTableVariableComponent],
  templateUrl: './variables-page.component.html',
  styleUrl: './variables-page.component.scss'
})
export class VariablesPageComponent {
  @ViewChild(NbTableVariableComponent) tableComponent!: NbTableVariableComponent;

  private _destroyRef = inject(DestroyRef);

  constructor(
    private _dialogService: NbDialogService,
    private _variableService: VariablesService,
    private _notificationService: NotificationToastService
  ) {}

  openTemplateVariable():void {
    const dialogRef = this._dialogService.open(VariableModalComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: true,
      hasScroll: false,
    });

    setTimeout(() => {
      const modalComponent = dialogRef.componentRef?.instance;
      if (modalComponent) {
        const emptyVariable: Variable = {
          id: 0,
          context: '',
          sql: '',
          list: false,
          certificateTypeId: 0
        };
        modalComponent.initialize(emptyVariable, false);
      }
    });

    dialogRef.onClose
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((result) => {
        if (result) {
          this.tableComponent.refreshTable();
        }
      });
  }
}
