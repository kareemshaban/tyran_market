import { EventService } from './../../services/event.service';
import { MarketService } from 'src/app/services/market.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as localforage from 'localforage';
import { Market } from 'src/app/Model/Market';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  phone: number ;
  market: Market ;
  markets: Market[] = [] ;
  res_any: any ;
  constructor(private router: Router , private marketService: MarketService , private eventService: EventService) { 
 
  }

  ngOnInit() {
    const interval = setInterval(() =>{
      clearInterval(interval);
      localforage
      .getItem('market')
      .then((res) => {
        console.log(res);
        if (res != null) {
          this.phone = Number(res);
          this.getMarket();
        } else {
          this.router.navigateByUrl('login');
        }
      })
      .catch((err) => {
        this.router.navigateByUrl('login');
      });
    }, 3000);
  }
  getMarket(){
     this.marketService.findMarket(this.phone).subscribe(res =>{
      this.res_any = res ;
      this.markets = this.res_any ;
      if(this.markets.length > 0){
        this.market = this.markets[0];
        this.marketService.setMarket(this.market);
        this.eventService.publishMarket(this.market);
      this.router.navigateByUrl('');
      } else {
         alert('نواجه بعض المشكلات في فتح حساب برجاء اعادة التسجيل او حاول لاحقا')
        this.router.navigateByUrl('login');
      }
     } , err =>{
      alert('نواجه بعض المشكلات في فتح حساب برجاء اعادة التسجيل او حاول لاحقا')

      this.router.navigateByUrl('login');
     });

  }
}
