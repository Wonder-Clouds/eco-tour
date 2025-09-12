import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDetailPage } from './service-detail';

describe('ServiceDetail', () => {
  let component: ServiceDetailPage;
  let fixture: ComponentFixture<ServiceDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
