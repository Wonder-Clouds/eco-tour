import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() description?: string;
  @Input() imageUrl?: string;
}
