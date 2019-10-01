import { Component, OnInit } from '@angular/core';
import {ChatServiceService} from '../chat-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  channelName: string;
  duplicatedChannel: boolean;
  createSuccess: boolean;
  channelInfo = {
    id: '',
    name: ''
  };
  messages = [];
  channels = [];

  constructor(private chatService: ChatServiceService) { }

  ngOnInit() {
    this.channelName = '';
    this.duplicatedChannel = false;
    this.createSuccess = false;
  }

  createChanel() {
    const bodyChannel = { name: this.channelName, members: ['admin1']};
    this.chatService.createChannel(bodyChannel).subscribe(data => {
      this.channelInfo.id = data.channel._id;
      this.channelInfo.name = data.channel.name;
      this.createSuccess = data.success;
      this.duplicatedChannel = false;
      this.getChannelList();
    },  () => {
      this.duplicatedChannel = true;
    });
  }

  loadChannelData(channel: any) {
    this.createSuccess = false;
    this.channelInfo = channel;
    this.createSuccess = true;
    // this.chatService.loadMessage(this.channelInfo).subscribe(data => {
    //   this.messages = data.messages.map( mess => {
    //     return mess.msg;
    //   });
    //   this.createSucess = true;
    // });
  }

  login() {
    this.chatService.login().subscribe();
    this.getChannelList();
  }

  getChannelList() {
    this.chatService.getChannelList().subscribe(data => {
      this.channels = data.channels.map(channel => {
        return { id: channel._id, name: channel.name } ;
      });
    });
  }
}
