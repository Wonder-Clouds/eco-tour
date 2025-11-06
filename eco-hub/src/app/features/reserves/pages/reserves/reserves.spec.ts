import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reserves } from './reserves';

describe('Reserves', () => {
  let component: Reserves;
  let fixture: ComponentFixture<Reserves>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reserves]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reserves);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
