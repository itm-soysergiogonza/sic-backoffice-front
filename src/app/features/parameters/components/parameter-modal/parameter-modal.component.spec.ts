import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterModalComponent } from './parameter-modal.component';

describe('ParameterModalComponent', () => {
  let component: ParameterModalComponent;
  let fixture: ComponentFixture<ParameterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParameterModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
