import { Component, OnInit } from '@angular/core';
import { FormActions } from '../../../../shared/components/form-actions/form-actions';
import { GroupApi } from '../../api/groups/group-api';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Group } from '../../../clients/types/Group';
import { CreateGroupRequest } from '../../types/Group';

@Component({
  selector: 'app-create-group',
  imports: [FormActions, ReactiveFormsModule],
  templateUrl: './create-group.html',
  styleUrl: './create-group.scss',
})
export class CreateGroup implements OnInit {
  groupForm!: FormGroup;

  loading = false;

  constructor(
    private groupApi: GroupApi,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      name: [''],
      contactInfo: [''],
      totalMembers: [''],
      description: [''],
    });
  }

  onSaveGroup(): void {
    this.loading = true;

    const payload: CreateGroupRequest = {
      name: this.groupForm.value.name,
      description: this.groupForm.value.description,
      contact_info: this.groupForm.value.contactInfo,
      total_people: this.groupForm.value.totalMembers,
    };

    this.groupApi.createGroup(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/grupos']);
      },
      error: (err) => {
        console.error('Error creando grupo', err);
        this.loading = false;
      },
    });
  }
}
