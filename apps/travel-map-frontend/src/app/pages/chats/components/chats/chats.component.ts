import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { ChatUserInterface } from '../../interfaces/chat-user.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, SpinnerService } from '@app/core';
import { WebSocketService } from '@app/core';
import { ChatMemberInterface } from '../../interfaces/chat-member.interface';
import { ChatMessageInterface } from '../../interfaces/chat-message.interface';
import { ChatsListComponent } from '../chats-list/chats-list.component';
import { MessagesComponent } from '../messages/messages.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { UnreadMessagesService } from '../../services/unread-messages.service';

@UntilDestroy()
@Component({
  selector: 'app-chats',
  imports: [ReactiveFormsModule, ChatsListComponent, MessagesComponent, TranslatePipe],
  providers: [ChatService],
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent {
  @ViewChild('messagesComponent') messagesComponent!: MessagesComponent;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  public chats: ChatMemberInterface[] = [];

  public isUserSelected = false;

  public selectedUser: ChatUserInterface | null = null;

  public selectedChat: ChatMemberInterface | null = null;

  public form!: FormGroup;

  public messages: ChatMessageInterface[] = [];

  public showScrollDown = false;

  private chatService: ChatService = inject(ChatService);

  private authService: AuthService = inject(AuthService);

  private fb: FormBuilder = inject(FormBuilder);

  private socketService: WebSocketService = inject(WebSocketService);

  private search = signal('');

  public isFocused = signal(false);

  private messageSub: Subscription | null = null;

  private readMessages$ = new Subject<void>();

  private unreadMessagesService = inject(UnreadMessagesService);

  private search$ = toObservable(this.search);

  private isFocused$ = toObservable(this.isFocused);

  private spinnerService: SpinnerService = inject(SpinnerService);

  public constructor() {
    this.loadChats();
    this.initForm();
    this.connectChat();
    this.readMessages();
  }

  public users = toSignal(
    combineLatest([this.search$, this.isFocused$]).pipe(
      filter(([_, focused]) => focused),
      map(([name]) => name),
      distinctUntilChanged(),
      debounceTime(300),
      switchMap((name) => this.chatService.loadAvailableUsers(name)),
    ),
    { initialValue: [] as ChatUserInterface[] },
  );

  public scrollToBottomSmooth(): void {
    this.messagesComponent?.scrollToBottomSmooth();
    this.showScrollDown = false;
  }

  public onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    this.showScrollDown = !isAtBottom;

    if (
      isAtBottom &&
      this.selectedChat?.chat?.id &&
      this.unreadMessagesService.getUnreadForChat(this.selectedChat.chat.id)()
    ) {
      this.readMessages$.next();
    }
  }

  private connectChat(): void {
    const token: string | null = this.authService.token;
    if (!token) return;

    this.socketService.connect(token).then(() => {
      if (this.selectedChat) {
        const chatId = this.selectedChat.chat.id;
        this.socketService.joinChat(chatId);

        this.messageSub?.unsubscribe();
        this.messageSub = this.socketService
          .onNewMessage()
          .pipe(filter((msg: ChatMessageInterface) => msg.chatId === chatId))
          .subscribe((msg: ChatMessageInterface) => {
            this.messages.push(msg);
          });
      }
    });
  }

  public loadAvailableUsers(name: string): void {
    this.search.set(name);
  }

  private initForm(): void {
    this.form = this.fb.group({
      message: [null, [Validators.required]],
    });
  }

  public onInputFocus(value: boolean): void {
    this.isUserSelected = value;
    this.isFocused.set(value);

    if (!value) {
      this.loadChats();
      this.selectedChat = null;
      this.selectedUser = null;
    }
  }

  public loadChats(): void {
    this.chatService
      .loadChats()
      .pipe(untilDestroyed(this))
      .subscribe((data: ChatMemberInterface[]) => {
        this.chats = data;
      });
  }

  public selectUser(user: ChatUserInterface): void {
    this.selectedUser = user;

    this.selectedChat = this.chats.find((chat: ChatMemberInterface) => chat.user.id === user.id) || null;

    if (this.selectedChat) {
      this.selectChat(this.selectedChat);
    } else {
      this.selectedChat = null;
      this.messages = [];
    }
  }

  public selectChat(chat: ChatMemberInterface): void {
    this.selectedChat = chat;
    this.selectedUser = null;
    this.loadMessages(chat.chat.id);
    this.connectChat();
  }

  private loadMessages(id: string): void {
    this.chatService
      .loadMessages(id)
      .pipe(untilDestroyed(this))
      .subscribe((data: ChatMessageInterface[]) => {
        this.messages = data;
        this.messagesComponent?.scrollToBottomSmooth();
      });
  }

  public sendMessage(): void {
    if (this.selectedChat?.chat?.id) {
      this.chatService.readMessages(this.selectedChat.chat.id).pipe(untilDestroyed(this)).subscribe();
    }

    if (!this.selectedUser && !this.selectedChat) return;

    if (this.form.valid) {
      this.chatService
        .sendMessage(
          this.form.value.message,
          this.authService.userId as string,
          this.selectedUser?.id || this.selectedChat?.user.id || '',
          this.selectedChat?.chat?.id,
        )
        .pipe(untilDestroyed(this))
        .subscribe((data: ChatMessageInterface) => {
          this.loadMessages(data.chat.id);
          this.loadChats();

          if (!this.selectedChat?.chat?.id) {
            this.selectChat({ chat: data.chat, user: this.selectedUser as ChatUserInterface });
          }

          this.form.reset();
        });
    }
  }

  private readMessages(): void {
    this.readMessages$
      .pipe(exhaustMap(() => this.chatService.readMessages(this.selectedChat?.chat.id as string)))
      .subscribe();
  }
}
