import { EventService } from './../../services/event.service';
import { Router } from '@angular/router';
import { Product } from './../../Model/Product';
import { Department } from './../../Model/Department';
import { Market } from './../../Model/Market';
import { MarketService } from 'src/app/services/market.service';
import { ModalController, ActionSheetController, ToastController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  market: Market ;
   cats: Department[] =[];
   products: Product[] = [] ;
   catid: number ;
   loaded: boolean = true ;
   res_any: any ;
   res_json: JSON ;
   markets: Market [] = [];
   base_url: string = 'https://dashboard.tayranapp.com/images/' ;
  constructor(private modalCtrl: ModalController , private marketService: MarketService , 
    private navctrl: NavController , private actionSheetController: ActionSheetController , 
    private toastControl: ToastController , private eventService: EventService) { }

  ngOnInit() {
  this.setData();
  }
  setData(){
    this.market = this.marketService.getMarket();
    if(this.market.departments.length > 0){
      this.catid = this.market.departments[0].id ;
      if(this.market.departments.filter(c=> c.id == this.catid).length > 0){
         this.products = this.market.departments.filter(c=> c.id == this.catid)[0].products ;
      } else {
        this.products = [] ;
      }
    }else {
      this.catid = 0;
      this.products = [] ;
    }
  }
  changeCat(pos: number){
    this.catid = pos ;
    if(this.market.departments.filter(c=> c.id == this.catid).length > 0){
      this.products = this.market.departments.filter(c=> c.id == this.catid)[0].products ;
   } else {
     this.products = [] ;
   }
  }
  async close(){
  this.navctrl.navigateRoot('/folder/0');
   await this.modalCtrl.dismiss();
  }

  async selectAction(id ,availbel) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'actionsheetct',
      header: 'تغيير الحالة إلي   ',
      buttons: [{
        text: availbel == 1 ? 'غير متاح '  : 
        'متاح',
        cssClass: 'actionsheet',
        handler: () => {
          this.changeItemAvailabel(id ,availbel === 0 ? 1 : 0);
        }
      }
      ]
    });
    await actionSheet.present();
  }
  changeItemAvailabel(id , ava){
    this.loaded = false ;
    this.marketService.changeProductState(id , ava).subscribe(res =>{
      this.res_any = JSON.stringify(res);
      this.res_json = JSON.parse(this.res_any);
      if( this.res_json['msg'] == 'success'){
        this.getMarket();

      } else {
        this.loaded = true ;
        console.log(this.res_json);
        this.presentToast('لا يمكن تنفيذ طلبك الأن' , 'danger' , 3000);
      }
    } , err =>{
      this.loaded = true ;
      console.log(err);
      this.presentToast('لا يمكن تنفيذ طلبك الأن' , 'danger' , 3000);
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
  getMarket(){
    this.marketService.findMarket(this.market.id).subscribe(res =>{
     this.res_any = res ;
     this.markets = this.res_any ;
     if(this.markets.length > 0){
       this.market = this.markets[0];
       this.marketService.setMarket(this.market);
       this.eventService.publishMarket(this.market);
       this.loaded = true ;
       this.setData();
       this.presentToast('تم تغيير حالة المنتج بنجاح' , 'success' , 3000);
     } else {
      this.loaded = true ;
      console.log(this.res_json);
      this.presentToast('لا يمكن تنفيذ طلبك الأن' , 'danger' , 3000);
     }
    } , err =>{
      this.loaded = true ;
      console.log(this.res_json);
      this.presentToast('لا يمكن تنفيذ طلبك الأن' , 'danger' , 3000);
    });

 }
}
