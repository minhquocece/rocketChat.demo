import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {WebSocketSubject} from 'rxjs/webSocket';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  url = 'http://localhost:3000/api/v1/';
  token = '';
  userId = '';
  httpOptions = {};

  constructor(private http: HttpClient) {
    this.login().subscribe(data => {
      this.token = data.data.authToken;
      this.userId = data.data.userId;
      this.httpOptions = {
        headers: new HttpHeaders({
          'X-Auth-Token': this.token,
          'X-User-Id': this.userId,
          'Content-Type': 'application/json',
        })
      };
    });

    // this.socket$ = new WebSocketSubject<any>('ws://localhost:3000/websocket');
    //
    // this.socket$.subscribe(
    //   (data) => {
    //     console.log(data);
    //     if (data.msg === 'ping') {
    //       this.socket$.next({msg: 'pong'});
    //     }
    //   },
    //   (err) => console.error(err),
    //   () => console.warn('Completed!')
    // );
    //
    // this.socket$.next({
    //     msg: 'connect',
    //     version: '1',
    //     support: ['1']
    //   }
    // );
    //
    // const loginRequest = {
    //   msg: 'method',
    //   method: 'login',
    //   id: 'EpWY5PbcHrbZMkaxN',
    //   params: [
    //     {resume: 'sGt0tjv5hl8I_JC-7EX1matkpapqZ7xsXFM-tQbkRiZ'}
    //   ]
    // };
    //
    // this.socket$.next(loginRequest);
    //
    // const room = {
    //   msg: 'method',
    //   method: 'rooms/get',
    //   id: 'EpWY5PbcHrbZMkaxN'
    // };
    //
    // const roomMess = {
    //   msg: 'sub',
    //   id: 'unique-id',
    //   name: 'stream-room-messages',
    //   params: [
    //     'GENERAL',
    //
    //   ]
    // };

    // this.socket$.next(roomMess);
  }
    createChannel(channelName: any): Observable<any> {
      return this.http.post<any>(this.url + 'channels.create', channelName,  this.httpOptions);
    }

    getChannelList(): Observable<any> {
      return this.http.get<any>(this.url + 'channels.list', this.httpOptions);
    }

    login(): Observable<any> {
      return this.http.post<any>(this.url + 'login', { user: 'admin', password: 'admin' });
    }

    loadMessage(channel: any): Observable<any> {
      return this.http.get<any>( this.url + 'channels.messages?roomId=' + channel.id, this.httpOptions);
    }

    returnIdentical(): any {
      return {Token: this.token, userId: this.userId}
    }

    sendMessage(msg: any): Observable<any> {
      return this.http.post<any>(this.url + 'chat.postMessage', msg, this.httpOptions);
    }
}
