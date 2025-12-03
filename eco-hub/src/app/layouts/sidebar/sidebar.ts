import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs/operators';
import {
  LucideAngularModule,
  Users,
  LayoutDashboard,
  BookMarked,
  Briefcase,
} from 'lucide-angular';

interface NavItem {
  label: string;
  route: string;
  svgPath: string;
  badge?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [
    LucideAngularModule,
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
    {
      label: 'Panel general',
      route: '/',
      svgPath: 'icons/chart-simple.svg',
    },
    {
      label: 'Servicios',
      route: '/servicios',
      svgPath: 'icons/bookmark.svg',
    },
    { label: 'Grupos', route: '/grupos', svgPath: 'icons/users.svg' },
    {
      label: 'Cotizaciones',
      route: '/cotizaciones',
      svgPath: 'icons/file-invoice.svg',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {});
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
