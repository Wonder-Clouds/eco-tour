import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Group } from '../../../clients/types/Group';
import { GroupApi } from '../../api/groups/group-api';
import { PaginatedResponse } from '../../../../models/PaginatedResponse';
import { Header } from '../../../../layouts/header/header';
import { Router } from '@angular/router';
import { LucideAngularModule, Pencil, Trash } from 'lucide-angular';

@Component({
  selector: 'app-groups',
  imports: [LucideAngularModule, Header, MatTableModule, MatTabsModule],
  templateUrl: './groups.html',
  styleUrl: './groups.scss',
})
export class Groups implements OnInit {
  readonly pencil = Pencil;
  readonly trash = Trash;

  groups: Group[] = [];
  loading = true;

  displayedColumns: string[] = [
    'name',
    'description',
    'contactInfo',
    'totalMembers',
    'actions',
  ];

  constructor(private router: Router, private groupsApi: GroupApi) {}

  ngOnInit(): void {
    this.getAllGroups();
  }

  getAllGroups() {
    this.groupsApi.getGroups().subscribe({
      next: (data: Group[]) => {
        this.groups = data ?? [];
      },
      error: (err) => {
        console.error('Error loading groups', err);
      },
    });
  }

  editGroup(groupId: string) {}

  deleteGroup(groupId: string) {}

  goToListMembers(group: any) {
    console.log('Navigating to members of group:', group);
    this.router.navigate(['/grupos', group.id, 'miembros']);
  }

  goToCreateGroup() {
    this.router.navigate(['grupos/crear-grupo']);
  }
}
