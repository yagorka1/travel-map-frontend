import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesComponent } from './messages.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '@app/core';
import { ChatMessageInterface } from '../../interfaces/chat-message.interface';
import { ChatUserInterface } from '../../interfaces/chat-user.interface';
import { ChatMemberInterface } from '../../interfaces/chat-member.interface';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let mockAuthService: jest.Mocked<Partial<AuthService>>;

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
    content: 'Hello, world!',
    senderId: 'user-1',
    sender: mockUser,
    created_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    mockAuthService = {
      userId: 'current-user-id',
    };

    await TestBed.configureTestingModule({
      imports: [MessagesComponent, TranslatePipe, TranslateModule.forRoot()],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should have default values', () => {
      expect(component.messages).toEqual([]);
      expect(component.selectedUser).toBeNull();
      expect(component.selectedChat).toBeNull();
    });

    it('should accept messages array', () => {
      component.messages = [mockMessage];
      expect(component.messages).toEqual([mockMessage]);
      expect(component.messages.length).toBe(1);
    });

    it('should accept selectedUser', () => {
      component.selectedUser = mockUser;
      expect(component.selectedUser).toEqual(mockUser);
    });

    it('should accept selectedChat', () => {
      component.selectedChat = mockChat;
      expect(component.selectedChat).toEqual(mockChat);
    });
  });

  describe('Initialization', () => {
    it('should get userId from AuthService on construction', () => {
      expect(component.userId).toBe('current-user-id');
    });

    it('should handle null userId from AuthService', async () => {
      TestBed.resetTestingModule();

      const nullUserIdAuthService = {
        userId: null,
      };

      await TestBed.configureTestingModule({
        imports: [MessagesComponent, TranslatePipe, TranslateModule.forRoot()],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: AuthService, useValue: nullUserIdAuthService },
        ],
      }).compileComponents();

      const newFixture = TestBed.createComponent(MessagesComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.userId).toBeNull();
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component['messagesEnd'] = {
        nativeElement: {
          scrollIntoView: jest.fn(),
        },
      } as any;
    });

    it('should scroll to bottom when messages change and chat changes', (done) => {
      component.messages = [mockMessage];
      component.selectedChat = mockChat;

      component.ngOnChanges();

      setTimeout(() => {
        expect(component['messagesEnd']?.nativeElement?.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'auto',
        });
        done();
      }, 10);
    });

    it('should use selectedChat chat id when available', (done) => {
      component.messages = [mockMessage];
      component.selectedChat = mockChat;
      component.selectedUser = null;

      component.ngOnChanges();

      setTimeout(() => {
        expect(component['previousChatId']).toBe('chat-1');
        done();
      }, 10);
    });

    it('should use selectedUser id when selectedChat is not available', (done) => {
      component.messages = [mockMessage];
      component.selectedUser = mockUser;
      component.selectedChat = null;

      component.ngOnChanges();

      setTimeout(() => {
        expect(component['previousChatId']).toBe('user-1');
        done();
      }, 10);
    });

    it('should not scroll if chat id has not changed', () => {
      component.messages = [mockMessage];
      component.selectedChat = mockChat;
      component['previousChatId'] = 'chat-1';

      component.ngOnChanges();

      expect(component['previousChatId']).toBe('chat-1');
    });

    it('should not scroll if messages array is empty', () => {
      const scrollSpy = jest.fn();
      component['messagesEnd'] = {
        nativeElement: {
          scrollIntoView: scrollSpy,
        },
      } as any;

      component.messages = [];
      component.selectedChat = mockChat;

      component.ngOnChanges();

      setTimeout(() => {
        expect(scrollSpy).not.toHaveBeenCalled();
      }, 10);
    });

    it('should not scroll if no chat or user is selected', () => {
      const scrollSpy = jest.fn();
      component['messagesEnd'] = {
        nativeElement: {
          scrollIntoView: scrollSpy,
        },
      } as any;

      component.messages = [mockMessage];
      component.selectedChat = null;
      component.selectedUser = null;

      component.ngOnChanges();

      setTimeout(() => {
        expect(scrollSpy).not.toHaveBeenCalled();
      }, 10);
    });
  });

  describe('scrollToBottomSmooth', () => {
    it('should call scrollIntoView with smooth behavior', () => {
      const scrollSpy = jest.fn();
      component['messagesEnd'] = {
        nativeElement: {
          scrollIntoView: scrollSpy,
        },
      } as any;

      component.scrollToBottomSmooth();

      expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should handle missing messagesEnd gracefully', () => {
      component['messagesEnd'] = undefined as any;

      expect(() => component.scrollToBottomSmooth()).not.toThrow();
    });

    it('should handle missing nativeElement gracefully', () => {
      component['messagesEnd'] = {} as any;

      expect(() => component.scrollToBottomSmooth()).not.toThrow();
    });
  });

  describe('Message display logic', () => {
    it('should identify own messages by userId', () => {
      component.userId = 'current-user-id';

      const ownMessage: ChatMessageInterface = {
        ...mockMessage,
        senderId: 'current-user-id',
      };

      expect(ownMessage.senderId).toBe(component.userId);
    });

    it('should identify other users messages', () => {
      component.userId = 'current-user-id';

      const otherMessage: ChatMessageInterface = {
        ...mockMessage,
        senderId: 'other-user-id',
      };

      expect(otherMessage.senderId).not.toBe(component.userId);
    });
  });
});
