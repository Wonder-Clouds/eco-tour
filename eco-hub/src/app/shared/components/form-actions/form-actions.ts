import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-actions',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './form-actions.html',
  styleUrl: './form-actions.scss',
})
export class FormActions {
  @Input() saveText = 'Guardar';
  @Input() cancelText = 'Cancelar';

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
