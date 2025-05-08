import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import {NbButtonModule, NbCardModule, NbDialogService, NbIconModule } from '@nebular/theme';
import { VariablesService } from '@shared/services/variables.service';
import { NbTableVariableComponent } from '../nb-table-variable/nb-table-variable.component';
import { NotificationToastService } from '@shared/services/notification-toast-service.service';
import { Router } from '@angular/router';


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
    private router: Router,
       
  ) {}

  openTemplateVariable():void {
    const dialogRef =  this.router.navigate(['/variables/create'])
    };

   
}
