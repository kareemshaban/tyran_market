import { Market } from './../Model/Market';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  market: Market ;
  baseUrl='https://dashboard.tayranapp.com/api/' ;
  login ='LoginMarket';
  find = 'FindMarket';
  updateUrl ='ChangeMarketState';
  updateProUrl = 'changeProductState';
  constructor(private http: HttpClient) { }

   getMarket(): Market{
    return this.market ;
   }
   setMarket(m: Market){
     this.market = m ;
   }
  loginMarket(name , pass): Observable<any>{
    const postData = {
      userName: name , 
      password: pass
    };
   return this.http.post(this.baseUrl + this.login , postData);
  }
  findMarket(id ): Observable<any>{
    const postData = {
      id: id 
    };
   return this.http.post(this.baseUrl + this.find , postData);
  }
  changeMarketState(id:number , state: number): Observable<any>{
    const postData = {
     id: id , 
     state:state
    };
  return  this.http.post(this.baseUrl + this.updateUrl , postData);
  }
  changeProductState(id:number , available: number): Observable<any>{
    const postData = {
     id: id , 
     available:available
    };
  return  this.http.post(this.baseUrl + this.updateProUrl , postData);
  }
}
