import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];
  messageChange = new Subject<Message[]>();
  messageFetching = new Subject<boolean>();
  messageUploading = new Subject<boolean>();
  messageUpdate = new Subject<boolean>();
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
        this.messages = result;
        this.messageFetching.next(false);
        this.messageChange.next(result);
      }, () => {
        this.messageFetching.next(false);
      });
  }

  start() {
    if (this.messages.length < 0) return;
    this.interval = setInterval(() => {
      this.http.get<[message: Message]>(`http://146.185.154.90:8000/messages?datetime=${this.messages[this.messages.length - 1].datetime}`).subscribe(
        result => {
          if (result.length > 0) {
            this.messageUpdate.next(true);
          }
        })
    }, 2000);
  }

  stop() {
    clearInterval(this.interval);
  }

  sendMessage(message: Message) {
    const body = new HttpParams()
      .set('author', message.author)
      .set('message', message.message);

    this.messageUploading.next(true);
    return this.http.post('http://146.185.154.90:8000/messages', body).pipe(
      tap(() => {
        this.messageUploading.next(false);
      }, () => {
        this.messageUploading.next(false);
      })
    );
  }
}
