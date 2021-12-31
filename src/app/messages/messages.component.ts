import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../shared/message.service';
import { Message } from '../shared/message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages: Message[] =[];
  messagesChangeSubscription!: Subscription;
  messagesFetchingSubscription!: Subscription;
  isFetching = false;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messages = this.messageService.getMessages();
    this.messagesFetchingSubscription = this.messageService.messageFetching.subscribe(isFetching => {
      this.isFetching = isFetching;
    });
    this.messagesChangeSubscription = this.messageService.messageChange.subscribe(messages => {
      this.messages = messages;
    });
    this.messageService.fetchMessages();
  }

  ngOnDestroy(): void {
    this.messagesFetchingSubscription.unsubscribe();
    this.messagesChangeSubscription.unsubscribe();
  }

}
