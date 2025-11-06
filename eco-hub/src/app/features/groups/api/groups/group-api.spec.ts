import { TestBed } from '@angular/core/testing';

import { GroupApi } from './group-api';

describe('GroupApi', () => {
  let service: GroupApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
