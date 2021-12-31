import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChange = new Subject<Message[]>();
  messageFetching = new Subject<boolean>();
  interval = 0;

  constructor(private http: HttpClient) {
  }

  fetchMessages() {
    this.messageFetching.next(true);
    this.http.get<[message: Message]>('http://146.185.154.90:8000/messages')
      .pipe(map(result => {
        return result.map(item => {
          return new Message(item.message, item.author, item.datetime, item.id);
        })
      }))
      .subscribe(result => {
        this.messageFetching.next(false);
        this.messageChange.next(result);
      }, () => {
        this.messageFetching.next(false);
      });
  }

  getMessages() {
    return this.messages.slice();
  }
}
