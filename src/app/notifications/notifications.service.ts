import { Injectable } from '@angular/core';
import { Subject, Observable, scan } from 'rxjs';

export interface Command {
  id: number;
  text?: string;
  type: 'success' | 'error' | 'clear';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  messagesInput: Subject<Command>;
  messagesOutput: Observable<Command[]>;
  private clearTimeout: number = 5000;

  constructor() {
    this.messagesInput = new Subject<Command>();
    this.messagesOutput = this.messagesInput.pipe(
      scan((messages: Command[], command: Command) => {
        if (command.type === 'clear') {
          return messages.filter((message: Command) => message.id !== command.id);
        } else {
          return [...messages, command];
        }
      }, [])
    );
  }

  addSuccess(message: string) {
    const id = this.randomId();
    this.messagesInput.next({ id, text: message, type: 'success' });

    setTimeout(() => {
      this.clearMessage(id);
    }, this.clearTimeout);
  }

  addError(error: string) {
    const id = this.randomId();
    this.messagesInput.next({ id, text: error, type: 'error' });

    setTimeout(() => {
      this.clearMessage(id);
    }, this.clearTimeout);
  }

  clearMessage(id: number) {
    this.messagesInput.next({ id, type: 'clear' });
  }

  private randomId(): number {
    return Math.round(Math.random() * 10000);
  }
}
