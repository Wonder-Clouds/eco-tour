import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  // Título dinámico
  @Input() title: string = 'SERVICIOS';

  // Funciones para los botones
  @Input() onAddClick!: () => void;
  @Input() onSettingsClick!: () => void;
}
