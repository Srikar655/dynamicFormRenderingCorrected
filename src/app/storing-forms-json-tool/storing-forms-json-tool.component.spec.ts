import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoringFormsJsonToolComponent } from './storing-forms-json-tool.component';

describe('StoringFormsJsonToolComponent', () => {
  let component: StoringFormsJsonToolComponent;
  let fixture: ComponentFixture<StoringFormsJsonToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoringFormsJsonToolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoringFormsJsonToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
