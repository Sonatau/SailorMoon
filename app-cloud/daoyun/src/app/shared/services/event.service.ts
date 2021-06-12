import { Injectable } from '@angular/core';
import * as EventEmitter from 'eventemitter3';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public eventEmit: any;
  
  constructor() { 
    this.eventEmit = new EventEmitter();
  }

}
