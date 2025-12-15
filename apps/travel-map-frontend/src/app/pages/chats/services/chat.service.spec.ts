import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { chatApi } from '../api/chat.api';
import { ChatMemberInterface } from '../interfaces/chat-member.interface';
import { ChatMessageInterface } from '../interfaces/chat-message.interface';
import { ChatUserInterface } from '../interfaces/chat-user.interface';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService],
    });
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadAvailableUsers', () => {
    it('should fetch available users', () => {
      const mockUsers: ChatUserInterface[] = [
        { id: '1', name: 'User 1', avatar: 'avatar1.jpg' },
        { id: '2', name: 'User 2', avatar: 'avatar2.jpg' },
      ];

      service.loadAvailableUsers('test').subscribe((users) => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(2);
      });

      const req = httpMock.expectOne(chatApi.chatUsers);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('loadChats', () => {
    it('should fetch all chats', () => {
      const mockChats: ChatMemberInterface[] = [
        {
          id: 'chat1',
          user: { id: '1', name: 'User 1', avatar: 'avatar1.jpg' },
          lastMessage: {
            id: 'msg1',
            content: 'Hello',
            senderId: '1',
            receiverId: '2',
            chatId: 'chat1',
            createdAt: '2024-01-01',
            isRead: true,
          },
          unreadCount: 0,
        },
      ];

      service.loadChats().subscribe((chats) => {
        expect(chats).toEqual(mockChats);
        expect(chats.length).toBe(1);
      });

      const req = httpMock.expectOne(chatApi.chatsList);
      expect(req.request.method).toBe('GET');
      req.flush(mockChats);
    });
  });

  describe('sendMessage', () => {
    it('should send a message without chatId', () => {
      const content = 'Hello World';
      const senderId = 'user1';
      const receiverId = 'user2';

      const mockResponse: ChatMessageInterface = {
        id: 'msg1',
        content,
        senderId,
        receiverId,
        chatId: 'newChat1',
        createdAt: '2024-01-01',
        isRead: false,
      };

      service.sendMessage(content, senderId, receiverId).subscribe((message) => {
        expect(message).toEqual(mockResponse);
        expect(message.content).toBe(content);
      });

      const req = httpMock.expectOne(chatApi.sendMessage);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ content, senderId, receiverId, chatId: undefined });
      req.flush(mockResponse);
    });

    it('should send a message with chatId', () => {
      const content = 'Hello again';
      const senderId = 'user1';
      const receiverId = 'user2';
      const chatId = 'existingChat1';

      const mockResponse: ChatMessageInterface = {
        id: 'msg2',
        content,
        senderId,
        receiverId,
        chatId,
        createdAt: '2024-01-01',
        isRead: false,
      };

      service.sendMessage(content, senderId, receiverId, chatId).subscribe((message) => {
        expect(message).toEqual(mockResponse);
        expect(message.chatId).toBe(chatId);
      });

      const req = httpMock.expectOne(chatApi.sendMessage);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ content, senderId, receiverId, chatId });
      req.flush(mockResponse);
    });
  });

  describe('loadMessages', () => {
    it('should fetch messages for a specific chat', () => {
      const chatId = 'chat123';
      const mockMessages: ChatMessageInterface[] = [
        {
          id: 'msg1',
          content: 'First message',
          senderId: 'user1',
          receiverId: 'user2',
          chatId,
          createdAt: '2024-01-01',
          isRead: true,
        },
        {
          id: 'msg2',
          content: 'Second message',
          senderId: 'user2',
          receiverId: 'user1',
          chatId,
          createdAt: '2024-01-02',
          isRead: true,
        },
      ];

      service.loadMessages(chatId).subscribe((messages) => {
        expect(messages).toEqual(mockMessages);
        expect(messages.length).toBe(2);
      });

      const req = httpMock.expectOne(chatApi.messages(chatId));
      expect(req.request.method).toBe('GET');
      req.flush(mockMessages);
    });
  });

  describe('readMessages', () => {
    it('should mark messages as read', () => {
      const chatId = 'chat123';

      service.readMessages(chatId).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(chatApi.readMessages(chatId));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(null);
    });
  });
});
