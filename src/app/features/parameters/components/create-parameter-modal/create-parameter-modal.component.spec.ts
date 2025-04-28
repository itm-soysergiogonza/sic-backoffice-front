import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateParameterModalComponent } from './create-parameter-modal.component';

describe('CreateParameterModalComponent', () => {
  let component: CreateParameterModalComponent;
  let fixture: ComponentFixture<CreateParameterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateParameterModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateParameterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
