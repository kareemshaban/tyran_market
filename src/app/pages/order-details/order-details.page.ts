import { CartItem } from 'src/app/Model/CartItem';

import { MarketService } from 'src/app/services/market.service';
import { Market } from './../../Model/Market';
import { Product } from './../../Model/Product';
import { ModalController } from '@ionic/angular';
import { OrderService } from './../../services/order.service';
import { Order } from './../../Model/Order';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  order: Order ;
  items: CartItem [] = [] ;
  products: Product [] = [] ;
  loaded: boolean ;
  list = [] ;
  market: Market ;
  baseUrl = 'https://dashboard.tayranapp.com/images/';
  total: number ;
  additionValue: number ;
  constructor(private orderService: OrderService , private modalCtrl: ModalController , 
    private  marketService: MarketService) { 

  }

  async close(){
   await this.modalCtrl.dismiss();
  }

  ngOnInit() {
    let cat = '' , size = '' , extras  , add = '' , add_value = 0;
    this.loaded = false ;
    this.market = this.marketService.getMarket();
    this.items = [] ;
    this.products = [] ;
    this.list = [] ;
    this.total = 0 ;
    this.additionValue = 0 ;
    console.log(this.market);
    this.order = this.orderService.getOrder();
    this.items = this.order.products.filter(c=> c.market_id == this.market.id) ;
     this.items.forEach(element => {
    

      if(element.extras.length > 0){
        this.additionValue = Number(  element.extras.reduce((a , b) =>  Number( a)  + Number(b.price) , 0)) * element.qnt;
        this.total += (Number( element.item.extras.filter(c=>c.id == element.size)[0].price) * element.qnt) +  this.additionValue  ;
   
       } else {
        this.total += Number( element.item.extras.filter(c=>c.id == element.size)[0].price) * element.qnt;
        this.additionValue  = 0 ;
       }

      
      if( this.market.departments.filter(c=> c.id == element.item.catId).length > 0  ){
        cat = this.market.departments.filter(c=> c.id == element.item.catId)[0].name ;
      }
      if(element.item.extras.filter(c=> c.id == element.size).length > 0){
        size = element.item.extras.filter(c=> c.id == element.size)[0].name ;
      }  else {
        size = '' ;
      }
      element.extras.forEach(ex => {
        if(!extras){
          extras = ex.name + ':' + element.qnt * ex.price + 'ج.م' ;
        } else {
          extras +=  '--' +  ex.name  + ':' +  element.qnt * ex.price + 'ج.م';
        }

        
      });
      add =  element.item.extras.filter(c=> c.id == element.addition).length ? 
      element.item.extras.filter(c=> c.id == element.addition)[0].name : '' ;

        this.list.push({catName:cat , name: element.item.name , size: size , extra:  extras , img: element.item.img , 
          price: element.item.extras.filter(c=> c.id == element.size)[0].price  , qnt: element.qnt , add: add  , details: element.details} );
        
          extras = null ;
        this.loaded = true ;
      
     });
    
    console.log(this.list);
  }
  async dismiss(state){
    await this.modalCtrl.dismiss({state: state});
  }

}
