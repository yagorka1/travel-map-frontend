import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsideMenuComponent } from './aside-menu.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('AsideMenuComponent', () => {
  let component: AsideMenuComponent;
  let fixture: ComponentFixture<AsideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideMenuComponent, RouterTestingModule, TranslatePipe, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AsideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
