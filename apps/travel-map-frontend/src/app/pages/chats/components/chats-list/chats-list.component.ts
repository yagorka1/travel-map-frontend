import { Component, inject, Input } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatUserInterface } from '../../interfaces/chat-user.interface';
import { NgOptimizedImage } from '@angular/common';
import { ChatMessageInterface } from '../../interfaces/chat-message.interface';
import { ChatMemberInterface } from '../../interfaces/chat-member.interface';

@Component({
  selector: 'app-chats-list',
  imports: [NgOptimizedImage],
  providers: [ChatService],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent {
  @Input() user!: ChatUserInterface;

  @Input() chat!: ChatMemberInterface;

  @Input()
  public messages: ChatMessageInterface[] = [];

  @Input()
  public isActive = false;
}
