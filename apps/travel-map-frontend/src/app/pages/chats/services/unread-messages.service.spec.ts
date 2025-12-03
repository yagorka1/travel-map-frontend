import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService, WebSocketService } from '@app/core';
import { of } from 'rxjs';
import { chatApi } from '../api/chat.api';
import { UnreadData, UnreadMessagesService } from './unread-messages.service';

describe('UnreadMessagesService', () => {
  let service: UnreadMessagesService;
  let httpMock: HttpTestingController;
  let authServiceMock: jest.Mocked<Partial<AuthService>>;
  let webSocketServiceMock: jest.Mocked<Partial<WebSocketService>>;

  beforeEach(() => {
    authServiceMock = {
      token: 'test-token-123',
    };

    webSocketServiceMock = {
      connect: jest.fn().mockResolvedValue(undefined),
      onUnreadCount: jest.fn().mockReturnValue(of()),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UnreadMessagesService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: WebSocketService, useValue: webSocketServiceMock },
      ],
    });
    service = TestBed.inject(UnreadMessagesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('totalUnread', () => {
    it('should return null initially', () => {
      expect(service.totalUnread()).toBeNull();
    });

    it('should return total unread count after data is set', () => {
      const mockData: UnreadData = {
        totalUnread: 5,
        chats: [
          { chatId: 'chat1', unreadCount: 3, lastMessage: null },
          { chatId: 'chat2', unreadCount: 2, lastMessage: null },
        ],
      };

      service['unreadData'].set(mockData);
      expect(service.totalUnread()).toBe(5);
    });
  });

  describe('chatsUnread', () => {
    it('should return empty array initially', () => {
      expect(service.chatsUnread()).toEqual([]);
    });

    it('should return chats unread data', () => {
      const mockData: UnreadData = {
        totalUnread: 5,
        chats: [
          { chatId: 'chat1', unreadCount: 3, lastMessage: null },
          { chatId: 'chat2', unreadCount: 2, lastMessage: null },
        ],
      };

      service['unreadData'].set(mockData);
      expect(service.chatsUnread()).toEqual(mockData.chats);
      expect(service.chatsUnread().length).toBe(2);
    });
  });

  describe('initialize', () => {
    it('should initialize WebSocket connection and subscribe to unread count', async () => {
      const mockUnreadData: UnreadData = {
        totalUnread: 3,
        chats: [{ chatId: 'chat1', unreadCount: 3, lastMessage: null }],
      };

      webSocketServiceMock.onUnreadCount = jest.fn().mockReturnValue(of(mockUnreadData));

      service.initialize();

      await Promise.resolve(); // Wait for promise to resolve

      expect(webSocketServiceMock.connect).toHaveBeenCalledWith('test-token-123');
      expect(webSocketServiceMock.onUnreadCount).toHaveBeenCalled();
    });

    it('should not initialize twice', async () => {
      service.initialize();
      await Promise.resolve();

      service.initialize();
      await Promise.resolve();

      expect(webSocketServiceMock.connect).toHaveBeenCalledTimes(1);
    });

    it('should warn when no token is available', () => {
      authServiceMock.token = null;
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      service.initialize();

      expect(consoleWarnSpy).toHaveBeenCalledWith('No token available for WebSocket connection');
      expect(webSocketServiceMock.connect).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should handle connection errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      webSocketServiceMock.connect = jest.fn().mockRejectedValue(new Error('Connection failed'));

      service.initialize();

      await Promise.resolve();
      await Promise.resolve(); // Extra tick for error handling

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getUnreadForChat', () => {
    it('should return 0 for unknown chat', () => {
      const unreadSignal = service.getUnreadForChat('unknown-chat');
      expect(unreadSignal()).toBe(0);
    });

    it('should return unread count for specific chat', () => {
      const mockData: UnreadData = {
        totalUnread: 5,
        chats: [
          { chatId: 'chat1', unreadCount: 3, lastMessage: null },
          { chatId: 'chat2', unreadCount: 2, lastMessage: null },
        ],
      };

      service['unreadData'].set(mockData);

      const unreadSignal = service.getUnreadForChat('chat1');
      expect(unreadSignal()).toBe(3);
    });
  });

  describe('reset', () => {
    it('should reset unread data and initialization flag', () => {
      const mockData: UnreadData = {
        totalUnread: 5,
        chats: [{ chatId: 'chat1', unreadCount: 5, lastMessage: null }],
      };

      service['unreadData'].set(mockData);
      service['isInitialized'] = true;

      service.reset();

      expect(service.totalUnread()).toBeNull();
      expect(service['isInitialized']).toBe(false);
    });
  });

  describe('getUnreadMessages', () => {
    it('should fetch unread messages from API', () => {
      const mockResponse: UnreadData = {
        totalUnread: 3,
        chats: [{ chatId: 'chat1', unreadCount: 3, lastMessage: null }],
      };

      service.getUnreadMessages().subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(chatApi.unreadMessages);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('setInitialUnreadMessagesCount', () => {
    it('should fetch and set initial unread messages count', () => {
      const mockResponse: UnreadData = {
        totalUnread: 7,
        chats: [
          { chatId: 'chat1', unreadCount: 4, lastMessage: null },
          { chatId: 'chat2', unreadCount: 3, lastMessage: null },
        ],
      };

      service.setInitialUnreadMessagesCount();

      const req = httpMock.expectOne(chatApi.unreadMessages);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      expect(service.totalUnread()).toBe(7);
      expect(service.chatsUnread().length).toBe(2);
    });
  });
});
