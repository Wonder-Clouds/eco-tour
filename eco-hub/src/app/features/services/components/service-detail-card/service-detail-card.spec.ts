import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDetailCard } from './service-detail-card';

describe('ServiceDetailCard', () => {
  let component: ServiceDetailCard;
  let fixture: ComponentFixture<ServiceDetailCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDetailCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceDetailCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
