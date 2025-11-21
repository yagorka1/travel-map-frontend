import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { TranslateModule } from '@ngx-translate/core';
import { ControlContainer } from '@angular/forms';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeAll(() => {
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: () => 'test-uuid',
      },
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, TranslateModule.forRoot()],
      providers: [ControlContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
