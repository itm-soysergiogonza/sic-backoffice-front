import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbCardModule, NbIconConfig, NbTabsetModule, NbButtonModule, NbDialogService, NbIconModule } from '@nebular/theme';
import { SignatureModalComponent } from '../signature-modal/signature-modal.component';

@Component({
  selector: 'nb-tabset-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NbCardModule, NbTabsetModule, NbButtonModule, NbIconModule],
  templateUrl: './tabset-icon.component.html',
  styles: [`
    :host nb-tab {
      padding: 1.25rem;
    }
  `],
})
export class TabsetIconComponent {
  bellIconConfig: NbIconConfig = { icon: 'bell-outline', pack: 'eva' };

  constructor(private dialogService: NbDialogService) {}

  openSignatureModal() {
    this.dialogService.open(SignatureModalComponent, {
      context: {
        title: 'Subir Firma'
      },
      dialogClass: 'signature-modal'
    });
  }
}
