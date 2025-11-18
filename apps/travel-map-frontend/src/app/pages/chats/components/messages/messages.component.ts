import { AfterViewChecked, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChatMessageInterface } from '../../interfaces/chat-message.interface';
import { AuthService } from '@app/core';
import { ChatUserInterface } from '../../interfaces/chat-user.interface';
import { ChatMemberInterface } from '../../interfaces/chat-member.interface';

@Component({
  selector: 'app-messages',
  imports: [NgOptimizedImage, DatePipe],
  providers: [ChatService],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements AfterViewChecked {
  @Input()
  public messages: ChatMessageInterface[] = [];

  @Input()
  public selectedUser: ChatUserInterface | null = null;

  @Input()
  public selectedChat: ChatMemberInterface | null = null;

  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  public userId: string | null = null;

  private authService: AuthService = inject(AuthService);

  constructor() {
    this.userId = this.authService.userId;
  }

  public ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    this.messagesEnd?.nativeElement?.scrollIntoView?.({ behavior: 'auto' });
    // this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
