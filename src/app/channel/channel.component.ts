import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatServiceService} from '../chat-service.service';
import {WebSocketSubject} from 'rxjs/webSocket';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
  @Input() channelInfo: {id: string, name: string};
  // @Input() messages: [any];
  messages = [];
  token = '';
  userId = '';
  rid = '';
  msg = '';

  private socket$: WebSocketSubject<any>;

  constructor(private chatService: ChatServiceService) { }

  ngOnInit() {
    this.token = this.chatService.returnIdentical().Token;
    this.userId = this.chatService.returnIdentical().userId;
    this.rid = (this.channelInfo && this.channelInfo.id) || '';
    this.messages = [];
    console.log(this.channelInfo);
    console.log(this.rid);
    console.log(this.messages);
    this.chatService.loadMessage(this.channelInfo).subscribe(data => {
      this.messages = data.messages.map( mess => {
        return mess.msg;
      });
    });
    this.socket$ = new WebSocketSubject<any>('ws://localhost:3000/websocket');

    this.socket$.subscribe(
      (data: any) => {
        console.log(this.messages);
        if (data.msg === 'ping') {
          this.socket$.next({msg: 'pong'});
        }
        if (data.msg === 'changed') {
          const msg = data.fields.args[0].msg;
          if (msg) {
            this.messages.push(msg);
          }
        }
      },
      (err) => console.error(err),
      () => console.warn('Completed!')
    );
    //
    this.socket$.next({
        msg: 'connect',
        version: '1',
        support: ['1']
    });

    const loginRequest = {
      msg: 'method',
      method: 'login',
      id: this.userId,
      params: [
        {resume: this.token}
      ]
    };

    this.socket$.next(loginRequest);

    const roomMess = {
      msg: 'sub',
      id: this.rid,
      name: 'stream-room-messages',
      params: [
        this.rid,
        true
      ]
    };

    this.socket$.next(roomMess);
  }

  sendMessage() {
    const msgBody = { channel: '#' + this.channelInfo.id, text: this.msg};
    this.chatService.sendMessage(msgBody).subscribe(data => {
      console.log(data);
    });
    this.msg = '';
  }

  // ngOnDestroy() {
  //   const unsub = {
  //     msg: 'unsub',
  //     id: this.rid,
  //     name: 'stream-room-messages',
  //     params: [
  //     this.rid,
  //     false
  //   ]
  //   };
  //   this.socket$.next(unsub);
  // }

}
