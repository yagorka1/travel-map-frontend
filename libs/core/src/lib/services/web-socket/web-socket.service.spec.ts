import { TestBed } from '@angular/core/testing';
import { io, Socket } from 'socket.io-client';
import { WebSocketEvents } from '../../enums/web-sockets-events.enum';
import { WebSocketService } from './web-socket.service';

// Mock socket.io-client
jest.mock('socket.io-client');

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockSocket: jest.Mocked<Partial<Socket>>;

  beforeEach(() => {
    // Create mock socket
    mockSocket = {
      id: 'mock-socket-id',
      connected: true,
      on: jest.fn(),
      emit: jest.fn(),
      off: jest.fn(),
      disconnect: jest.fn(),
    };

    // Mock io function
    (io as jest.Mock).mockReturnValue(mockSocket);

    TestBed.configureTestingModule({
      providers: [WebSocketService],
    });
    service = TestBed.inject(WebSocketService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('connect', () => {
    it('should connect to WebSocket server with token', async () => {
      const token = 'test-token-123';

      // Simulate successful connection
      (mockSocket.on as jest.Mock).mockImplementation((event, callback) => {
        if (event === 'connect') {
          callback();
        }
      });

      await service.connect(token);

      expect(io).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          auth: { token },
          transports: ['websocket'],
        }),
      );
    });

    it('should resolve immediately if already connected', async () => {
      const token = 'test-token-123';

      // First connection
      (mockSocket.on as jest.Mock).mockImplementation((event, callback) => {
        if (event === 'connect') {
          callback();
        }
      });

      await service.connect(token);
      const firstCallCount = (io as jest.Mock).mock.calls.length;

      // Second connection attempt
      await service.connect(token);
      const secondCallCount = (io as jest.Mock).mock.calls.length;

      // Should not create a new connection
      expect(secondCallCount).toBe(firstCallCount);
    });

    it('should reject on connection error', async () => {
      const token = 'test-token-123';
      const error = new Error('Connection failed');

      // Simulate connection error
      (mockSocket.on as jest.Mock).mockImplementation((event, callback) => {
        if (event === 'connect_error') {
          callback(error);
        }
      });

      await expect(service.connect(token)).rejects.toThrow('Connection failed');
    });

    it('should log connection success', async () => {
      const token = 'test-token-123';
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      (mockSocket.on as jest.Mock).mockImplementation((event, callback) => {
        if (event === 'connect') {
          callback();
        }
      });

      await service.connect(token);

      expect(consoleLogSpy).toHaveBeenCalledWith('WS connected', 'mock-socket-id');

      consoleLogSpy.mockRestore();
    });

    it('should log connection error', async () => {
      const token = 'test-token-123';
      const error = new Error('Network error');
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (mockSocket.on as jest.Mock).mockImplementation((event, callback) => {
        if (event === 'connect_error') {
          callback(error);
        }
      });

      try {
        await service.connect(token);
      } catch (e) {
        // Expected to throw
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith('WS connection error', 'Network error');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('joinChat', () => {
    it('should emit join event with chatId when connected', async () => {
      const token = 'test-token-123';
      const chatId = 'chat-123';

      (mockSocket.on as jest.Mock).mockImplementation((event, callback) => {
        if (event === 'connect') {
          callback();
        }
      });

      await service.connect(token);
      service.joinChat(chatId);

      expect(mockSocket.emit).toHaveBeenCalledWith('join', chatId);
    });

    it('should warn if socket is not connected', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockSocket.connected = false;

      // Manually set socket to test warning
      service['socket'] = mockSocket as Socket;
      service.joinChat('chat-123');

      expect(consoleWarnSpy).toHaveBeenCalledWith('Socket not connected yet');
      expect(mockSocket.emit).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('onNewMessage', () => {
    it('should create observable that listens to new messages', (done) => {
      const mockMessage = { id: 'msg1', content: 'Hello', senderId: 'user1' };

      (mockSocket.on as jest.Mock).mockImplementation((event, callback) => {
        if (event === WebSocketEvents.NEW_MESSAGE) {
          callback(mockMessage);
        }
      });

      service['socket'] = mockSocket as Socket;

      service.onNewMessage().subscribe((message) => {
        expect(message).toEqual(mockMessage);
        done();
      });
    });
  });

  describe('onUnreadCount', () => {
    it('should create observable that listens to unread count updates', (done) => {
      const mockUnreadData = {
        totalUnread: 5,
        chats: [{ chatId: 'chat1', unreadCount: 5 }],
      };

      (mockSocket.on as jest.Mock).mockImplementation((event, callback) => {
        if (event === WebSocketEvents.UNREAD_COUNT) {
          callback(mockUnreadData);
        }
      });

      service['socket'] = mockSocket as Socket;

      service.onUnreadCount().subscribe((data) => {
        expect(data).toEqual(mockUnreadData);
        done();
      });
    });
  });
});
