import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-members',
  imports: [],
  templateUrl: './group-members.html',
  styleUrl: './group-members.scss',
})
export class GroupMembers {
  groupId!: number;

  constructor(private route: ActivatedRoute) {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
  }
}
