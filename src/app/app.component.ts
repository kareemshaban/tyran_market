import { EventService } from './services/event.service';
import { Market } from './Model/Market';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: ' الرئيسية', url: '/folder/0', icon: 'home' },
    { title: 'الطلبات الجديدة', url: '/folder/1', icon: 'notifications' },
    { title: 'الطلبات الحالية', url: '/folder/2', icon: 'construct' },
    { title: 'الطلبات المنتهية',  url: '/folder/3', icon: 'albums' },
    { title: 'قائمة المنتجات ',  url: '/folder/4', icon: 'basket' },
    { title: ' حالة المطعم',  url: '/folder/5', icon: 'build' },


    // { title: 'تسجيل الخروج',  url: '/folder/', icon: 'exit' },

  ];
  market: Market ;
  constructor(private router: Router , private eventService: EventService) {
    this.eventService.receivemarket().subscribe(res =>{
      this.market = res ;
    });
     this.initializeApp();
  }
  initializeApp() {
      StatusBar.setBackgroundColor({color: 'DB4524'});
      this.router.navigateByUrl('splash');
  }
}
