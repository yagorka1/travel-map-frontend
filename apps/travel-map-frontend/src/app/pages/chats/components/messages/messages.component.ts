import { Component, inject, Input } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { NgOptimizedImage } from '@angular/common';
import { ChatMessageInterface } from '../../interfaces/chat-message.interface';
import { AuthService } from '@app/core';

@Component({
  selector: 'app-messages',
  imports: [NgOptimizedImage],
  providers: [ChatService],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  @Input()
  public messages: ChatMessageInterface[] = [];

  public userId: string | null = null;

  private authService: AuthService = inject(AuthService);

  constructor() {
    this.userId = this.authService.userId;
  }
}
