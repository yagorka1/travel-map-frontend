import { Component, inject, signal } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { ChatUserInterface } from '../../interfaces/chat-user.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@app/core';
import { ChatMemberInterface } from '../../interfaces/chat-member.interface';
import { ChatMessageInterface } from '../../interfaces/chat-message.interface';
import { ChatsListComponent } from '../chats-list/chats-list.component';
import { MessagesComponent } from '../messages/messages.component';
import { NgStyle } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@UntilDestroy()
@Component({
  selector: 'app-chats',
  imports: [ReactiveFormsModule, ChatsListComponent, MessagesComponent, NgStyle],
  providers: [ChatService],
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent {
  public chats: ChatMemberInterface[] = [];
  public isUserSelected = false;
  public selectedUser: ChatUserInterface | null = null;
  public selectedChat: ChatMemberInterface | null = null;
  public form!: FormGroup;
  public messages: ChatMessageInterface[] = [];

  private chatService: ChatService = inject(ChatService);
  private authService: AuthService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);

  private search = signal('');
  public isFocused = signal(false);

  private search$ = toObservable(this.search);
  private isFocused$ = toObservable(this.isFocused);

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

  public constructor() {
    this.loadChats();
    this.initForm();
  }

  public loadAvailableUsers(name: string) {
    this.search.set(name);
  }

  private initForm(): void {
    this.form = this.fb.group({
      message: [null, Validators.required],
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
    this.selectedChat = null;
  }

  public selectChat(chat: any): void {
    this.selectedChat = chat;
    this.selectedUser = null;
    this.loadMessages(chat.chat.id);
  }

  private loadMessages(id: string): void {
    this.chatService
      .loadMessages(id)
      .pipe(untilDestroyed(this))
      .subscribe((data: ChatMessageInterface[]) => {
        this.messages = data;
      });
  }

  public sendMessage(): void {
    if (!this.selectedUser && !this.selectedChat) return;

    this.chatService
      .sendMessage(
        this.form.value.message,
        this.authService.userId as string,
        this.selectedUser?.id || this.selectedChat?.id || '',
        this.selectedChat?.chat?.id,
      )
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.loadMessages(data.chat.id);
        this.form.reset();
      });
  }
}
