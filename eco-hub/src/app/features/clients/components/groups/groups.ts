import { Component, OnInit } from '@angular/core';
import { GroupApi } from '../../api/groups/group-api';
import { Group } from '../../types/Group';
import { PaginatedResponse } from '../../../../models/PaginatedResponse';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-groups',
  imports: [MatTableModule],
  templateUrl: './groups.html',
  styleUrl: './groups.scss',
})
export class Groups implements OnInit {
  groups: Group[] = [];
  loading = true;

  displayedColumns: string[] = ['name', 'contactInfo', 'totalMembers'];

  constructor(private groupsApi: GroupApi) {}

  ngOnInit(): void {
    this.getAllGroups();
  }

  getAllGroups() {
    this.groupsApi.getGroups().subscribe({
      next: (data: PaginatedResponse<Group>) => {
        this.groups = data.results ?? [];
      },
      error: (err) => {
        console.error('Error loading groups', err);
      },
    });
  }
}
