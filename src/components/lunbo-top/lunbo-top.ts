import { Component,Input } from '@angular/core';
declare let Swiper: any;

@Component({
  selector: 'lunbo-top',
  templateUrl: 'lunbo-top.html'
})
export class LunboTopComponent {
  @Input() lunbTopList;

  constructor() {

  }
  ngOnInit(): void {
    setTimeout(() => {
      new Swiper ('#top', {
        spaceBetween: 30,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        centeredSlides: true,
        loop:true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        })
    }, 500);
  }

}
