import { Component } from '@angular/core';
import { NbCardModule, NbTabComponent } from '@nebular/theme';
import { TabsetIconComponent } from '../tabset-icon/tabset-icon.component';

@Component({
  selector: 'app-profile-page',
  imports: [NbCardModule, TabsetIconComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

}
