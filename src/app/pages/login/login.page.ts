import { EventService } from './../../services/event.service';
import { Router } from '@angular/router';
import { Market } from './../../Model/Market';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { MarketService } from 'src/app/services/market.service';
import * as localforage from 'localforage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loaded: boolean ;
  username: string ;
  password: string ;
  market: Market ;
  markets: Market[] = [] ;
  res_any: any ;
  constructor(private marketService: MarketService , private toastControl: ToastController , private router: Router , 
    private eventService: EventService) {
    this.loaded = true ;
  }

  ngOnInit() {
  }
  loginMarket(){
    if(this.username && this.password){
    this.loaded = false ;
    this.marketService.loginMarket(this.username , this.password).subscribe(res =>{
      console.log(res);
       this.res_any = res ;
       this.markets = this.res_any ;
       if(this.markets.length > 0){
         this.market = this.markets[0];
         this.marketService.setMarket(this.market);
          this.storeUser();
       } else {
        this.loaded = true ;
        this.presentToast('لا يمكن تنفيذ طلبك الأن الرجاء التأكد من ان بيانات الدخول صحيحة' , 'danger' , 3000);
       }
    } , err =>{
      console.log(err );
      this.loaded = true ;
      this.presentToast('  برجاء التأكد من ان بيانات الدخول صحيحة' , 'danger' , 3000);
    });
  } else {
    this.presentToast('برجاء ادخال اسم المستخدم وكلمة المرور' , 'danger' , 3000);
  }
  }
  storeUser( ){
    this.eventService.publishMarket(this.market);
    localforage.getItem('market').then(res => {
      res = this.market.id ;
      localforage.setItem('market' , res).then(data => {
       this.loaded = true ;
       this.presentToast('تم تسجيل الدخول بنجاح' , 'success' , 3000);
        this.router.navigateByUrl('');
      });
    });
  }
  async presentToast(_message: string, mColor: string, mduration: number) {
    const toast = await this.toastControl.create({
      message: _message,
      position: 'bottom',
      color: mColor,
      duration: mduration,
      cssClass: 'toast_css'
    });
    toast.present();
  }
}
