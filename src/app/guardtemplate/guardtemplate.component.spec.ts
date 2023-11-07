import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardtemplateComponent } from './guardtemplate.component';

describe('GuardtemplateComponent', () => {
  let component: GuardtemplateComponent;
  let fixture: ComponentFixture<GuardtemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuardtemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
