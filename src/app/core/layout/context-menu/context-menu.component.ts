import {Component, Inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {
  NB_WINDOW,
  NbButtonModule,
  NbContextMenuModule, NbMenuBag,
  NbMenuService,
  NbPosition,
  NbThemeService,
  NbUserModule,
} from '@nebular/theme';
import { AuthService } from '../../services/auth.service';

type ThemeOption = 'default' | 'cosmic' | 'system';

@Component({
  selector: 'nb-context-menu',
  templateUrl: './context-menu.component.html',
  standalone: true,
  imports: [NbContextMenuModule, NbButtonModule, NbUserModule],
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuClickComponent implements OnInit {
  items = [
    { title: 'Perfil', icon: 'person-outline', link: '/perfil' },
    {
      title: 'Tema',
      icon: 'color-palette-outline',
      children: [
        { title: 'Claro ', icon: 'sun-outline' },
        { title: 'Oscuro', icon: 'moon-outline' },
        { title: 'Sistema', icon: 'monitor-outline' },
      ],
    },
    { title: 'Cerrar Sesión', icon: 'log-out-outline', link: '/logout' },
  ];

  public userName = '';
  public userEmail = '';
  public ProfilePhoto = 'https://ui-avatars.com/api/?name=Usuario+ITM&background=0D8ABC&color=fff';

  constructor(
    private _nbMenuService: NbMenuService,
    private _themeService: NbThemeService,
    private _router: Router,
    private _authService: AuthService,
    @Inject(NB_WINDOW) private window: Window
  ) {}

  ngOnInit(): void {
    this._initializeTheme();
    this._setupSystemThemeListener();
    this._setupMenuListener();
    this._setupUserData();
  }

  private _setupUserData(): void {
    // Obtener datos iniciales
    const currentUser = this._authService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.name;
      this.userEmail = currentUser.email;
      this.ProfilePhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=0D8ABC&color=fff`;
    }

    // Suscribirse a cambios
    this._authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.name;
        this.userEmail = user.email;
        this.ProfilePhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`;
      }
    });
  }

  private _initializeTheme(): void {
    const savedTheme = localStorage.getItem('user-theme');

    if (!savedTheme) {
      localStorage.setItem('user-theme', 'system');
      this._handleSystemTheme();
    } else {
      if (savedTheme === 'system') {
        this._handleSystemTheme();
      } else {
        this._themeService.changeTheme(savedTheme as ThemeOption);
      }
    }
  }

  private _handleSystemTheme(): void {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme: "cosmic" | "default" = isDarkMode ? 'cosmic' : 'default';
    this._themeService.changeTheme(theme);
  }

  private _setupSystemThemeListener(): void {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        if (localStorage.getItem('user-theme') === 'system') {
          const newTheme: "cosmic" | "default" = event.matches ? 'cosmic' : 'default';
          this._themeService.changeTheme(newTheme);
        }
      });
  }

  private _setupMenuListener(): void {
    this._nbMenuService.onItemClick().subscribe(({ item }) => {
      if (item.title === 'Theme') return;

      if (item.title === 'Logout') {
        this._authService.logout();
        this._router.navigate(['/auth/login']);
        return;
      }

      if (item.title === 'Profile') {
        this._router.navigate(['/perfil']);
        return;
      }

      if (item.title === 'Light') {
        this._changeAndSaveTheme('default');
      } else if (item.title === 'Dark') {
        this._changeAndSaveTheme('cosmic');
      } else if (item.title === 'System') {
        this._changeAndSaveTheme('system');
        this._handleSystemTheme();
      }
    });
  }

  private _changeAndSaveTheme(theme: ThemeOption): void {
    this._themeService.changeTheme(theme);
    localStorage.setItem('user-theme', theme);
  }

  protected readonly NbPosition: typeof NbPosition = NbPosition;
}
