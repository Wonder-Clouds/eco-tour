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

  selectedMembers: string[] = [];

  getMembers() {
    return this.group?.person ?? [];
  }

  toggleSelection(id: string) {
    if (this.selectedMembers.includes(id)) {
      this.selectedMembers = this.selectedMembers.filter((x) => x !== id);
    } else {
      this.selectedMembers.push(id);
    }
  }
}
