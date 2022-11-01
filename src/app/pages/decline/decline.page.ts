import { Router } from '@angular/router';
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { ModalController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-decline',
  templateUrl: './decline.page.html',
  styleUrls: ['./decline.page.scss'],
})
export class DeclinePage implements OnInit {

  notes: string ;
  constructor(private modalCtrl: ModalController , private platform: Platform , private router: Router) { }

  ngOnInit() {
  }
  async close(){
    // this.navCtrl.back();
      await this.modalCtrl.dismiss();
}
async decline(){
 if(this.notes ){
  await this.modalCtrl.dismiss({notes: this.notes});
 } else {
   alert(' برجاء ادخال سبب الرفض');
 }

}
ionViewDidEnter() {
  this.platform.backButton.subscribeWithPriority(9999, () => {

    document.addEventListener('backbutton', function(event) {
      event.preventDefault(); event.stopPropagation();
    }, false);

     this.close();
     this.router.navigateByUrl('');
  });

}
}
