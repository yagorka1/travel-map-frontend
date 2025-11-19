import { Component, ElementRef, inject, Input, OnChanges, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { DatePipe } from '@angular/common';
import { ChatMessageInterface } from '../../interfaces/chat-message.interface';
import { AuthService } from '@app/core';
import { ChatUserInterface } from '../../interfaces/chat-user.interface';
import { ChatMemberInterface } from '../../interfaces/chat-member.interface';

@Component({
  selector: 'app-messages',
  imports: [DatePipe],
  providers: [ChatService],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnChanges {
  @Input()
  public messages: ChatMessageInterface[] = [];

  @Input()
  public selectedUser: ChatUserInterface | null = null;

  @Input()
  public selectedChat: ChatMemberInterface | null = null;

  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  public userId: string | null = null;

  private previousChatId: string | null = null;

  private authService: AuthService = inject(AuthService);

  constructor() {
    this.userId = this.authService.userId;
  }

  public ngOnChanges() {
    const chatId = this.selectedChat?.chat?.id || this.selectedUser?.id;

    if (chatId && chatId !== this.previousChatId && this.messages.length > 0) {
      setTimeout(() => this.scrollToBottomAuto(), 0);
      this.previousChatId = chatId;
    }
  }

  private scrollToBottomAuto() {
    this.messagesEnd?.nativeElement?.scrollIntoView?.({ behavior: 'auto' });
  }

  public scrollToBottomSmooth() {
    this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
  }
}
