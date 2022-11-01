import { Observable } from 'rxjs';
import { Order } from './../Model/Order';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = 'https://dashboard.tayranapp.com/api/' ;
  getOrdersUrl = 'marketOrders/';

  deliveurlr= 'deliver';

  orders: Order[] = [] ;
  order: Order ;

  constructor(private http: HttpClient) { }

  getOrders(): Order[]{
    return this.orders ;
  }
   setOrders(os: Order[]){
     this.orders = os ;
   }

   getOrder(): Order{
    return this.order ;
  }
   setOrder(os: Order){
     this.order = os ;
   }
  marketOrders(id: number): Observable<any>{
  return this.http.get(this.baseUrl + this.getOrdersUrl + id );
  }
  deliver(mid: number , mstate: number , mmarket_id:number , mnotes: string = ''): Observable<any>{
    const postData  = {
      id: mid , 
      state: mstate, 
      market_id: mmarket_id , 
      notes: mnotes
    };
   return this.http.post(this.baseUrl + this.deliveurlr , postData);
  }
}
