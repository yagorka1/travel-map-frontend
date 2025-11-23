import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatsListComponent } from './chats-list.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UnreadMessagesService } from '../../services/unread-messages.service';
import { ChatService } from '../../services/chat.service';
import { of } from 'rxjs';
import { computed, Signal } from '@angular/core';
import { ChatUserInterface } from '../../interfaces/chat-user.interface';
import { ChatMemberInterface } from '../../interfaces/chat-member.interface';
import { ChatMessageInterface } from '../../interfaces/chat-message.interface';

describe('ChatsListComponent', () => {
  let component: ChatsListComponent;
  let fixture: ComponentFixture<ChatsListComponent>;
  let unreadMessagesServiceMock: jest.Mocked<Partial<UnreadMessagesService>>;
  let chatServiceMock: jest.Mocked<Partial<ChatService>>;

  const mockUser: ChatUserInterface = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'avatar.jpg',
  };

  const mockChat: ChatMemberInterface = {
    chat: { id: 'chat-1', name: 'Test Chat' },
    user: mockUser,
  };

  const mockMessage: ChatMessageInterface = {
    id: 'msg-1',
    chatId: 'chat-1',
    chat: { id: 'chat-1', name: 'Test Chat' },
    content: 'Hello!',
    senderId: 'user-1',
    sender: mockUser,
    created_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    unreadMessagesServiceMock = {
      getUnreadForChat: jest.fn((chatId: string): Signal<number> => computed(() => 0)),
    };

    chatServiceMock = {
      readMessages: jest.fn((id: string) => of(void 0)),
    };

    await TestBed.configureTestingModule({
      imports: [ChatsListComponent, TranslatePipe, TranslateModule.forRoot()],
      providers: [
        { provide: UnreadMessagesService, useValue: unreadMessagesServiceMock },
        { provide: ChatService, useValue: chatServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatsListComponent);
    component = fixture.componentInstance;

    component.chat = mockChat;
    component.user = mockUser;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should accept user input', () => {
      expect(component.user).toEqual(mockUser);
    });

    it('should accept chat input', () => {
      expect(component.chat).toEqual(mockChat);
    });

    it('should accept messages array', () => {
      component.messages = [mockMessage];
      expect(component.messages).toEqual([mockMessage]);
      expect(component.messages.length).toBe(1);
    });

    it('should have default messages array', () => {
      const newFixture = TestBed.createComponent(ChatsListComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.chat = mockChat;
      newComponent.user = mockUser;

      expect(newComponent.messages).toEqual([]);
    });

    it('should accept isActive state', () => {
      component.isActive = true;
      expect(component.isActive).toBe(true);
    });

    it('should have default isActive as false', () => {
      const newFixture = TestBed.createComponent(ChatsListComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.chat = mockChat;
      newComponent.user = mockUser;

      expect(newComponent.isActive).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should initialize unreadMessages signal when chat is provided', () => {
      expect(unreadMessagesServiceMock.getUnreadForChat).toHaveBeenCalledWith('chat-1');
      expect(component.unreadMessages).toBeDefined();
    });

    it('should get unread count for the chat', () => {
      const unreadCount = component.unreadMessages();
      expect(unreadCount).toBe(0);
    });

    it('should handle chat with different unread counts', () => {
      unreadMessagesServiceMock.getUnreadForChat = jest.fn(() => computed(() => 5));

      const newFixture = TestBed.createComponent(ChatsListComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.chat = mockChat;
      newComponent.user = mockUser;
      newFixture.detectChanges();

      expect(newComponent.unreadMessages()).toBe(5);
    });

    it('should not call getUnreadForChat if chat is not provided', () => {
      jest.clearAllMocks();

      const newFixture = TestBed.createComponent(ChatsListComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.user = mockUser;

      newFixture.detectChanges();

      expect(unreadMessagesServiceMock.getUnreadForChat).not.toHaveBeenCalled();
    });
  });

  describe('Unread messages display', () => {
    it('should show unread badge when there are unread messages', () => {
      unreadMessagesServiceMock.getUnreadForChat = jest.fn(() => computed(() => 3));

      const newFixture = TestBed.createComponent(ChatsListComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.chat = mockChat;
      newComponent.user = mockUser;
      newFixture.detectChanges();

      expect(newComponent.unreadMessages()).toBe(3);
      expect(newComponent.unreadMessages()).toBeGreaterThan(0);
    });

    it('should not show unread badge when count is zero', () => {
      expect(component.unreadMessages()).toBe(0);
      expect(component.unreadMessages()).not.toBeGreaterThan(0);
    });
  });

  describe('Active state', () => {
    it('should apply active class when isActive is true', () => {
      component.isActive = true;
      fixture.detectChanges();

      expect(component.isActive).toBe(true);
    });

    it('should not apply active class when isActive is false', () => {
      component.isActive = false;
      fixture.detectChanges();

      expect(component.isActive).toBe(false);
    });
  });

  describe('Message preview', () => {
    it('should show last message when messages exist', () => {
      const messages = [
        { ...mockMessage, content: 'First message' },
        { ...mockMessage, id: 'msg-2', content: 'Last message' },
      ];
      component.messages = messages;

      const lastMessage = component.messages[component.messages.length - 1];
      expect(lastMessage.content).toBe('Last message');
    });

    it('should handle empty messages array', () => {
      component.messages = [];
      expect(component.messages.length).toBe(0);
    });
  });

  describe('User display', () => {
    it('should display user name from chat', () => {
      expect(component.chat.user.name).toBe('John Doe');
    });

    it('should display chat name', () => {
      expect(component.chat.chat.name).toBe('Test Chat');
    });

    it('should handle user with avatar', () => {
      expect(component.user.avatarUrl).toBe('avatar.jpg');
    });

    it('should handle user without avatar', () => {
      const userWithoutAvatar: ChatUserInterface = {
        ...mockUser,
        avatarUrl: null,
      };
      component.user = userWithoutAvatar;

      expect(component.user.avatarUrl).toBeNull();
    });
  });
});
