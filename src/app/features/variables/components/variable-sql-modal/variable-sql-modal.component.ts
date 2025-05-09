import { Component } from '@angular/core';
import { NbDialogRef, NbCardModule, NbButtonModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-variable-sql-modal',
    standalone: true,
    templateUrl: './variable-sql-modal.component.html',
    styleUrls: ['./variable-sql-modal.component.scss'],
    imports: [CommonModule, NbCardModule, NbButtonModule],
})
export class VariableSqlModalComponent {
    public sql: string = '';
    public variables: { nombre: string, valor: string }[] = [];
  

    constructor(protected dialogRef: NbDialogRef<VariableSqlModalComponent>) { }

    close(): void {
        this.dialogRef.close();
    }

    public contenido: any[] = [];
    public tipoContenido: 'variables' | 'parameters' | 'sql' = 'sql'; // por defecto

    initialize(contenido: any[], tipo: 'variables' | 'sql' | 'parameters'): void {
        this.contenido = contenido;
        this.tipoContenido = tipo;
    }

}
