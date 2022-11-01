import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { DeclinePage } from './../pages/decline/decline.page';
import { ProductsPage } from './../pages/products/products.page';
import { EventService } from './../services/event.service';
import { Product } from './../Model/Product';
import { OrderDetailsPage } from './../pages/order-details/order-details.page';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { Order } from './../Model/Order';
import { OrderService } from './../services/order.service';
import { Market } from './../Model/Market';
import { MarketService } from 'src/app/services/market.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  market: Market ;
  title: string ;
  orders:Order[] = [] ;
  loaded: boolean = false ;
  orderList = [] ;
  state: number ;
  audio: any ;
  order: Order ;
  products: Product [] = [] ;
  product: Product  ;
  type: number = 0 ;
  interact: boolean = false ;
  marketState: string = '' ;
  marketStateImg: string  = '' ;
  res_any: any ;
  res_json: JSON ;
  markets: Market[] =[] ;
  interval: any ;
  constructor(private activatedRoute: ActivatedRoute , private marketService: MarketService , private vibration:Vibration ,
    private orderService: OrderService , private toastControl: ToastController , private modalCtrl: ModalController , 
    private actionSheetController: ActionSheetController , private eventService: EventService , 
    private modalController: ModalController , private router: Router , private backgroundMode: BackgroundMode ) {
   

   }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
     if(this.folder == '0'){
      this.title = 'الرئيسية ' ;
      this.type = 0 ;
     }
    if(this.folder == '1'){
       this.title = 'الطلبات الجديدة' ;
       this.type = 0 ;
       this.state =  0 ;
     } else if (this.folder == '2'){
      this.type = 0 ;
      this.title = 'الطلبات الحالية' ;
      this.state =  1;
    } else if(this.folder == '3'){
      this.type = 0 ;
      this.title = 'الطلبات المنتهية' ;
      this.state = 3;
    }
    else if(this.folder == '4'){
      console.log('here');
      this.openSearch();
    } else if(this.folder == '5'){
      this.type = 2 ;
      this.title = 'تغيير حالة المطعم';
      this.setMarketState();

    }

    this.market =  this.marketService.getMarket();
    this.getOrders();
     this.interval = setInterval(() =>{
       this.getOrders();
    } , 10000);
  }

  async openSearch() {
    const modal = await this.modalController.create({
      component: ProductsPage,
      componentProps: {
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
       // this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      
      }
    });

    return await modal.present();
  }
  
  setMarketState(){
    this.market =  this.marketService.getMarket();
  if(this.market.state === 1 ){
    this.marketState = 'حالة المطعم يعمل يستقبل طلبات جديدة';
    this.marketStateImg = '../../assets/images/working.png';
  } else if (this.market.state === 2){
    this.marketState = 'حالة المطعم مشغول لا يمكن استقبال طلبات جديدة';
    this.marketStateImg = '../../assets/images/busy.png';
  } else if (this.market.state === 3){
    this.marketState = 'حالة المطعم مغلق لا يمكن استقبال طلبات جديدة';
    this.marketStateImg = '../../assets/images/closed-sign.png';
  }
  }
  async openDetails(id){
    console.log(id);
    this.orderService.setOrder(this.order);
    const  modal = await this.modalCtrl.create({
      cssClass: 'my-custom-modal-css',
      component: DeclinePage,
      componentProps: {}
    });
    modal.onDidDismiss().then((result) => {
      if(result.data){
        console.log(result.data.notes);
         this.decline(id , result.data.notes);
      }
    });
    return await modal.present();
   }
   
  decline(id , notes){
    console.log(id);
    if(this.orders.filter(c=> c.id == id).length > 0){
      this.loaded = false ;
      console.log(id);
       this.orderService.deliver(id , 2 , this.market.id , notes).subscribe(res =>{
         console.log(res);
        this.orderService.setOrders(res);
        this.orders = this.orderService.getOrders();
        this.loaded = true ;
        this.setOrders();
          this.presentToast('تم رفض الطلب  ' , 'success' , 3000);

       } , err =>{
         console.log(err);
        this.loaded = true ;
        this.presentToast('برجاء المحاولة لاحقا' , 'danger' , 3000);
       });
    }
  }
  playNotification(){
    if(this.audio){
     // this.audio.stop();
    }
     this.audio = new Audio();
    const audiosrc = '../../assets/mb3/notification.mp3';
    console.log(audiosrc);
    this.audio.src = audiosrc;

    this.audio.load();
    this.audio.play();
    this.vibration.vibrate(0);
    this.vibration.vibrate(200);
  }
  getOrders(){
    
    this.orderService.marketOrders(this.market.id).subscribe(res =>{
      console.log(res);
    this.orderService.setOrders(res);
    this.orders = this.orderService.getOrders();
    if(this.orders.filter(c=> c.state == 0).length > 0){
      this.playNotification();
     }
    this.loaded = true ;
    this.setOrders();
    }, err =>{
      this.loaded = true ;
    });
  }
  deliver(id , state){
    if(this.orders.filter(c=> c.id == id).length > 0){
      this.loaded = false ;
       this.orderService.deliver(id , state , this.market.id).subscribe(res =>{
        this.orderService.setOrders(res);
        this.orders = this.orderService.getOrders();
        this.loaded = true ;
        this.setOrders();

        if(state == 1){
          this.presentToast('تم قبول واستلام الطلب  ' , 'success' , 3000);
        } else {
          this.presentToast('تم تسليم الطلب  ' , 'success' , 3000);
        }


       } , err =>{
         console.log(err);
        this.loaded = true ;
        this.presentToast('برجاء المحاولة لاحقا' , 'danger' , 3000);
       });
    }
  }
  details(id){
    console.log(id);
    if(this.orders.filter(c=> c.id == id).length > 0){
      this.orderService.setOrder(this.orders.filter(c=> c.id == id)[0]);
      //this.close();
     // this.router.navigateByUrl('order-details');
      this.openDetailsModal(id);
    }
  }
  async openDetailsModal(id){
    console.log(id);
    const  modal = await this.modalCtrl.create({
      component: OrderDetailsPage,
      componentProps: {}
    });
    modal.onDidDismiss().then((result) => {
      if(result.data){
        if(Number(result.data.state) === 2){
          console.log(id);
          this.openDetails(id);
        } else {
          console.log(id);
          this.deliver(id , Number(result.data.state));

        }
      }
    });
    return await modal.present();
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

  setOrders(){
    this.orderList = [] ;
    this.products = [];
    let state = "" ;
     this.orders.sort((a , b) =>  b.id - a.id) ;
     this.orders.forEach(element => {
       if(this.folder == '0'){
        if(element.state === 0 || element.state === 1){
          if (element.state === 0)   {
           state = ' طلب جديد  ' ;
         }
        else if (element.state === 1)   {
          state = '  جاري تنفيذه  ' ;
        }
   
         let total = 0 , net = 0 ;
  
          element.products.filter(c=> c.market_id == this.market.id).forEach(ele => {
             if(ele.extras.length > 0){
              total += (Number( ele.item.extras.filter(c=>c.id == ele.size)[0].price) * ele.qnt) + Number(  ele.extras.reduce((a , b) =>  Number( a)  + Number(b.price) , 0)) ;
         
             } else {
              total += Number( ele.item.extras.filter(c=>c.id == ele.size)[0].price) * ele.qnt;
             }
             
          });
  
          net = total - element.discount ;
  
  
          const startd = new Date().getDate() ;
          const endd = new Date(element.delivery_date.toString()).getDate() ;
  
          const starth = new Date().getHours() ;
          const endh = new Date(element.delivery_date.toString()).getHours() ;
  
          const start = new Date().getMinutes() ;
          const end = new Date(element.delivery_date.toString()).getMinutes() ;
           const ti =   (start - end ) + ((startd -endd ) * 24 * 60 ) + ((starth - endh) *60);
            const timevar = 'منذ' + ' ' + ti + ' ' + 'دقيقة';
         this.orderList.push({order_number: element.id , state: state , total: total , delivery_val: element.delivery_value , 
           discount: element.discount , net: net , state_num: element.state , 
           time: timevar  , type: element.delivey_type});
         }
       } else {
       if(element.state === this.state){
        if (element.state === 0)   {
         state = ' طلب جديد  ' ;
       }
       else if (element.state === 2 )   {
         state = ' طلب مرفوض ' ;
       }
       else if (element.state === 3 )   {
         state = ' طلب منتهي ' ;
       }
       else if (element.state === 4 )   {
        state = ' قيد التنفيذ  ' ;
      }
      else if (element.state === 5 )   {
        state = 'طلب منتهي   ' ;
      }
       let total = 0 , net = 0 ;

        element.products.filter(c=> c.market_id == this.market.id).forEach(ele => {
           if(ele.extras.length > 0){
            total += (Number( ele.item.extras.filter(c=>c.id == ele.size)[0].price) * ele.qnt) + Number(  ele.extras.reduce((a , b) =>  Number( a)  + Number(b.price) , 0)) ;
       
           } else {
            total += Number( ele.item.extras.filter(c=>c.id == ele.size)[0].price) * ele.qnt;
           }
           
        });

        net = total - element.discount ;


        const startd = new Date().getDate() ;
        const endd = new Date(element.delivery_date.toString()).getDate() ;

        const starth = new Date().getHours() ;
        const endh = new Date(element.delivery_date.toString()).getHours() ;

        const start = new Date().getMinutes() ;
        const end = new Date(element.delivery_date.toString()).getMinutes() ;
         const ti =   (start - end ) + ((startd -endd ) * 24 * 60 ) + ((starth - endh) *60);
          const timevar = 'منذ' + ' ' + ti + ' ' + 'دقيقة';
       this.orderList .push({order_number: element.id , state: state , total: total , delivery_val: element.delivery_value , 
         discount: element.discount , net: net , state_num: element.state , 
         time: timevar });
       }
      }
       console.log(this.orderList);
      //  if(this.orderList.filter(c=> c.state_num == 0).length > 0){
      //   this.playNotification();
      //  }
     });
  }
  

    async selectAction() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'actionsheetct',
      header: 'تغيير الحالة إلي   ',
      buttons: [{
        text: 'يعمل ',
        cssClass: 'actionsheet',
        // icon: 'construct',
        handler: () => {
          this.changeMarketState(1);
        }
      },
      {
        text: ' مشغول',
        cssClass: 'actionsheet',
        // icon: 'notifications-off',
        handler: () => {
          this.changeMarketState(2);
        }
      },
      {
        text: ' مغلق',
        cssClass: 'actionsheet',
        // icon: 'close',
        handler: () => {
          this.changeMarketState(3);
        }
      }
      ]
    });
    await actionSheet.present();
  }
  changeMarketState(state){
    this.loaded = false ;
    this.marketService.changeMarketState(this.market.id , state).subscribe(res =>{
      this.res_any = JSON.stringify(res);
      this.res_json = JSON.parse(this.res_any);
      if( this.res_json['msg'] == 'success'){
        this.getMarket();

      } else {
        this.loaded = true ;
        console.log(this.res_json);
        this.presentToast('لا يمكن تنفيذ طلبك الأن' , 'danger' , 3000);
      }
    }, err =>{
      this.loaded = true ;
      console.log(err);
      this.presentToast('لا يمكن تنفيذ طلبك الأن' , 'danger' , 3000);
    });
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
       this.presentToast('تم تغيير حالة مطعمك بنجاح' , 'success' , 3000);
       this.setMarketState();
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
