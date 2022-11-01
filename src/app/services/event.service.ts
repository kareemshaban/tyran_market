import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

  private market = new Subject<any>(); 

  publishMarket(data: any) {
    this.market.next(data);
}

receivemarket(): Subject<any> {
    return this.market;
}
}
