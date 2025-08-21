import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  @Input() isCollapsed = false;

  navItems: NavItem[] = [
    { label: 'Panel general', route: '/', icon: 'dashboard' },
    { label: 'Servicios', route: '/servicios', icon: 'business_center' },
    { label: 'Finanzas', route: '/finanzas', icon: 'account_balance' },
    { label: 'Reportes', route: '/reportes', icon: 'analytics' },
    { label: 'Clientes', route: '/clientes', icon: 'people' },
  ];

  settingsItems: NavItem[] = [
    { label: 'Configuración', route: '/configuracion', icon: 'settings' },
    { label: 'Ayuda', route: '/ayuda', icon: 'help_outline' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Lógica adicional si es necesaria
      });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }
}
