import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesModalComponent } from './types-modal.component';

describe('TypesModalComponent', () => {
  let component: TypesModalComponent;
  let fixture: ComponentFixture<TypesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
