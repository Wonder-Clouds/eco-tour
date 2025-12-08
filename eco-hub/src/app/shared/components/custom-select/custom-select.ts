import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  imports: [],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.scss',
})
export class CustomSelect<T> {
  @Input() items: T[] = [];
  @Input() selectedItem: T | null = null;
  @Input() label: string = 'Seleccionar';
  @Input() placeholder: string = 'Selecciona una opción';
  @Input() displayKey: string = 'name'; // Propiedad a mostrar (ej: 'name', 'title', 'description')
  @Input() trackKey: string = 'id'; // Propiedad para track (ej: 'id', 'code')

  @Output() selectionChange = new EventEmitter<T>();

  isOpen = false;

  selectItem(item: T) {
    this.selectedItem = item;
    this.selectionChange.emit(item);
    this.isOpen = false;
  }

  getDisplayValue(item: T): string {
    if (!item) return '';
    return (item as any)[this.displayKey] || String(item);
  }

  isSelected(item: T): boolean {
    if (!this.selectedItem || !item) return false;

    // Compara por la key de tracking
    return (
      (this.selectedItem as any)[this.trackKey] === (item as any)[this.trackKey]
    );
  }

  trackByFn(index: number, item: T): any {
    return (item as any)[this.trackKey] || index;
  }
}
