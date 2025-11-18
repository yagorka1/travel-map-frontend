import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatsListComponent } from './chats-list.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

describe('ChatsListComponent', () => {
  let component: ChatsListComponent;
  let fixture: ComponentFixture<ChatsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatsListComponent, TranslatePipe, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
