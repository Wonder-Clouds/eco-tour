import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Person } from '../../../clients/types/Person';
import { GroupApi } from '../../api/groups/group-api';
import { Group } from '../../../clients/types/Group';

@Component({
  selector: 'app-group-members',
  imports: [MatTableModule],
  templateUrl: './group-members.html',
  styleUrl: './group-members.scss',
})
export class GroupMembers implements OnInit {
  members: Person[] = [];
  groupId!: string;

  loading = true;

  displayedColumns: string[] = [
    'position',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'birthDate',
    'nationality',
  ];

  constructor(private route: ActivatedRoute, private groupsApi: GroupApi) {
    this.groupId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit(): void {
    this.getGroupMembers();
  }

  getGroupMembers() {
    this.groupsApi.getGroupById(this.groupId).subscribe({
      next: (res: Group) => {
        this.members = res.person ?? [];
      },
      error: (err) => {
        console.error('Error loading groups', err);
      },
    });
  }
}
