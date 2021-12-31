import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from '../../shared/message.model';
import { Subscription } from 'rxjs';
import { MessageService } from '../../shared/message.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit, OnDestroy {
  @ViewChild('f') messageForm!: NgForm;
  messageUploadingSubscription!: Subscription;
  isUploading = false;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.messageUploading.subscribe(isUploading => {
      this.isUploading = isUploading;
    });
  }

  sendMessage() {
    if (!this.messageForm.value.message.trim().length || !this.messageForm.value.author.trim().length) return;
    const id = Math.random().toString();
    const message = new Message(this.messageForm.value.message, this.messageForm.value.author, id, id);
    this.messageService.sendMessage(message).subscribe();
  }

  ngOnDestroy(): void {
    this.messageUploadingSubscription.unsubscribe();
  }

}
