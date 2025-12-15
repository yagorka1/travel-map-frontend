import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatsComponent } from './chats.component';
import { ChatService } from '../../services/chat.service';
import { AuthService, WebSocketService } from '@app/core';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChatUserInterface } from '../../interfaces/chat-user.interface';
import { ChatMemberInterface } from '../../interfaces/chat-member.interface';
import { ChatMessageInterface } from '../../interfaces/chat-message.interface';
import { UnreadMessagesService } from '../../services/unread-messages.service';
import { computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

if (typeof global.crypto === 'undefined') {
  (global as any).crypto = {};
}

if (typeof global.crypto.randomUUID === 'undefined') {
  (global as any).crypto.randomUUID = () => 'test-uuid';
}

describe('ChatsComponent (Jest)', () => {
  let component: ChatsComponent;
  let fixture: ComponentFixture<ChatsComponent>;
  let mockChatService: jest.Mocked<Partial<ChatService>>;
  let mockAuthService: jest.Mocked<Partial<AuthService>>;
  let mockWebSocketService: jest.Mocked<Partial<WebSocketService>>;
  let mockUnreadMessagesService: jest.Mocked<Partial<UnreadMessagesService>>;
  let mockTranslateService: jest.Mocked<Partial<TranslateService>>;

  const mockUser: ChatUserInterface = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    avatarUrl: null,
  };

  const mockChat: ChatMemberInterface = {
    chat: { id: 'chat-1', name: 'Test Chat' },
    user: mockUser,
  };

  const mockMessage: ChatMessageInterface = {
    id: 'msg-1',
    chatId: 'chat-1',
    chat: { id: 'chat-1', name: 'Test Chat' },
    content: 'Test message',
    senderId: 'user-1',
    sender: mockUser,
    created_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    mockAuthService = {
      token: 'test-token',
      userId: 'user-1',
    };

    mockWebSocketService = {
      connect: jest.fn().mockResolvedValue(undefined),
      joinChat: jest.fn(),
      onNewMessage: jest.fn().mockReturnValue(of(mockMessage)),
      onUnreadCount: jest.fn().mockReturnValue(of({ totalUnread: 0, chats: [] })),
    };

    mockUnreadMessagesService = {
      getUnreadForChat: jest.fn().mockReturnValue(computed(() => 0)),
      initialize: jest.fn(),
      setInitialUnreadMessagesCount: jest.fn(),
    };

    mockChatService = {
      loadChats: jest.fn().mockReturnValue(of([mockChat])),
      loadAvailableUsers: jest.fn().mockReturnValue(of([mockUser])),
      loadMessages: jest.fn().mockReturnValue(of([mockMessage])),
      sendMessage: jest.fn().mockReturnValue(of(mockMessage)),
      readMessages: jest.fn().mockReturnValue(of(undefined)),
    };

    mockTranslateService = {
      get: jest.fn().mockReturnValue(of('translated')),
      instant: jest.fn().mockReturnValue('translated'),
    };

    await TestBed.configureTestingModule({
      imports: [ChatsComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: WebSocketService, useValue: mockWebSocketService },
        { provide: UnreadMessagesService, useValue: mockUnreadMessagesService },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ChatsComponent, {
        set: {
          providers: [{ provide: ChatService, useValue: mockChatService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ChatsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with message control', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('message')).toBeTruthy();
  });

  it('should have initial state values', () => {
    expect(component.isUserSelected).toBe(false);
    expect(component.selectedUser).toBeNull();
    expect(component.selectedChat).toBeNull();
    expect(component.showScrollDown).toBe(false);
  });

  describe('selectUser', () => {
    it('should set selectedUser when user is selected', () => {
      component.chats = [mockChat];

      component.selectUser(mockUser);

      expect(component.selectedUser).toBeNull();
      expect(component.selectedChat).toEqual(mockChat);
    });

    it('should clear chat data if no existing chat exists', () => {
      component.chats = [];

      component.selectUser(mockUser);

      expect(component.selectedUser).toEqual(mockUser);
      expect(component.selectedChat).toBeNull();
      expect(component.messages).toEqual([]);
    });
  });

  describe('selectChat', () => {
    it('should select chat and load messages', () => {
      component.selectChat(mockChat);

      expect(component.selectedChat).toEqual(mockChat);
      expect(component.selectedUser).toBeNull();
      expect(mockChatService.loadMessages).toHaveBeenCalledWith('chat-1');
    });
  });

  describe('sendMessage', () => {
    it('should not send if no user or chat is selected', () => {
      component.form.patchValue({ message: 'Hello' });
      component.selectedUser = null;
      component.selectedChat = null;

      component.sendMessage();

      expect(mockChatService.sendMessage).not.toHaveBeenCalled();
    });

    it('should send message when user is selected and form is valid', () => {
      component.form.patchValue({ message: 'Hello' });
      component.selectedUser = mockUser;

      component.sendMessage();

      expect(mockChatService.sendMessage).toHaveBeenCalled();
    });

    it('should not send message if form is invalid', () => {
      component.form.patchValue({ message: '' });
      component.selectedUser = mockUser;

      component.sendMessage();

      expect(mockChatService.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('onInputFocus', () => {
    it('should set focus state to true', () => {
      component.onInputFocus(true);

      expect(component.isUserSelected).toBe(true);
      expect(component.isFocused()).toBe(true);
    });

    it('should clear selections when unfocused', () => {
      component.selectedChat = mockChat;
      component.selectedUser = mockUser;

      component.onInputFocus(false);

      expect(component.isUserSelected).toBe(false);
      expect(component.isFocused()).toBe(false);
      expect(component.selectedChat).toBeNull();
      expect(component.selectedUser).toBeNull();
    });
  });

  describe('loadAvailableUsers', () => {
    it('should update search signal', () => {
      component.loadAvailableUsers('test');

      expect(component['search']()).toBe('test');
    });
  });

  describe('onScroll', () => {
    it('should hide scroll button when at bottom', () => {
      const mockEvent = {
        target: {
          scrollTop: 100,
          scrollHeight: 200,
          clientHeight: 100,
        },
      } as any;

      component.onScroll(mockEvent);

      expect(component.showScrollDown).toBe(false);
    });

    it('should show scroll button when not at bottom', () => {
      const mockEvent = {
        target: {
          scrollTop: 0,
          scrollHeight: 200,
          clientHeight: 100,
        },
      } as any;

      component.onScroll(mockEvent);

      expect(component.showScrollDown).toBe(true);
    });
  });

  describe('scrollToBottomSmooth', () => {
    it('should call messagesComponent method if it exists', () => {
      component.messagesComponent = {
        scrollToBottomSmooth: jest.fn(),
      } as any;

      component.scrollToBottomSmooth();

      expect(component.messagesComponent.scrollToBottomSmooth).toHaveBeenCalled();
      expect(component.showScrollDown).toBe(false);
    });

    it('should handle missing messagesComponent', () => {
      component.messagesComponent = undefined as any;

      expect(() => component.scrollToBottomSmooth()).not.toThrow();
      expect(component.showScrollDown).toBe(false);
    });
  });

  describe('loadChats', () => {
    it('should call chatService.loadChats', () => {
      component.loadChats();

      expect(mockChatService.loadChats).toHaveBeenCalled();
    });
  });
});
