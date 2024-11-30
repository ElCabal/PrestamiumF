import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxAddComponent } from './box-add.component';

describe('BoxAddComponent', () => {
  let component: BoxAddComponent;
  let fixture: ComponentFixture<BoxAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
