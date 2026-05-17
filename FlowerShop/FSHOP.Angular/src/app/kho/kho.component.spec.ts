import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhoComponent } from './kho.component';

describe('KhoComponent', () => {
  let component: KhoComponent;
  let fixture: ComponentFixture<KhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
