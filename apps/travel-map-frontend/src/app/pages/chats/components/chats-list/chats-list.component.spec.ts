import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatsListComponent } from './chats-list.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UnreadMessagesService } from '../../services/unread-messages.service';
import { ChatService } from '../../services/chat.service';
import { ChatsComponent } from '../chats/chats.component';
import { of } from 'rxjs';
import { computed, Signal } from '@angular/core';

describe('ChatsListComponent', () => {
  let component: ChatsListComponent;
  let fixture: ComponentFixture<ChatsListComponent>;
  let unreadMessagesServiceMock: Partial<UnreadMessagesService>;
  let chatServiceMock: Partial<ChatService>;

  beforeEach(async () => {
    unreadMessagesServiceMock = {
      getUnreadForChat: (chatId: string): Signal<number> => computed(() => 0),
    };
    chatServiceMock = {
      readMessages: (id: string) => of(void 0),
    };

    await TestBed.configureTestingModule({
      imports: [ChatsComponent, TranslatePipe, TranslateModule.forRoot()],
      providers: [
        { provide: UnreadMessagesService, useValue: unreadMessagesServiceMock },
        { provide: ChatService, useValue: chatServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatsListComponent);
    component = fixture.componentInstance;

    component.chat = {
      chat: { id: '1', name: 'Test chat' },
      user: { id: 'u1', name: 'User', avatarUrl: null, email: 'user@example.com' },
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
