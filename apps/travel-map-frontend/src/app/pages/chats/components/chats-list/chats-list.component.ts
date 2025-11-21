import { Component, inject, Input, OnInit, Signal } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatUserInterface } from '../../interfaces/chat-user.interface';
import { ChatMessageInterface } from '../../interfaces/chat-message.interface';
import { ChatMemberInterface } from '../../interfaces/chat-member.interface';
import { UnreadMessagesService } from '../../services/unread-messages.service';
import { AvatarComponent } from '@app/core';

@Component({
  selector: 'app-chats-list',
  imports: [AvatarComponent],
  providers: [ChatService],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent implements OnInit {
  @Input() user!: ChatUserInterface;

  @Input() chat!: ChatMemberInterface;

  @Input()
  public messages: ChatMessageInterface[] = [];

  @Input()
  public isActive = false;

  public unreadMessages!: Signal<number>;

  private unreadMessagesService = inject(UnreadMessagesService);

  public ngOnInit() {
    if (this.chat) {
      this.unreadMessages = this.unreadMessagesService.getUnreadForChat(this.chat.chat.id);
    }
  }
}
