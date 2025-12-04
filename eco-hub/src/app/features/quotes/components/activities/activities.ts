import { Component, Input } from '@angular/core';
import { Service } from '../../../../models/Service';
import { Group } from '../../../clients/types/Group';

@Component({
  selector: 'app-activities',
  imports: [],
  templateUrl: './activities.html',
  styleUrl: './activities.scss',
})
export class Activities {
  @Input() activity: Service | null = null;
  @Input() group: Group | null = null;

  getMembers() {
    return this.group?.person ?? [];
  }
}
