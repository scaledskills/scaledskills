import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss']
})
export class HomeBannerComponent implements OnInit, AfterViewInit {
  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    load: 3,
    interval: { timing: 4000, initialDelay: 1000 },
    loop: true,
    touch: true,
    velocity: 0.2,
    point: {
      visible: true
    },
  }
  carouselItems = [
    {
      'name': '1.jpg'
    },
    {
      'name': '2.jpg'
    }
  ];
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}



// import { Component,  ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
// import { NguCarouselConfig } from '@ngu/carousel';
// @Component({
//   selector: 'app-home-banner',
//   templateUrl: './home-banner.component.html',
//   styleUrls: ['./home-banner.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush
// })

// export class HomeBannerComponent implements AfterViewInit {
//   name = 'Angular';
//   slideNo = 0;
//   withAnim = true;
//   resetAnim = true;

//   carouselConfig: NguCarouselConfig = {
//     grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
//     load: 3,
//     interval: {timing: 4000, initialDelay: 1000},
//     loop: true,
//     touch: true,
//     velocity: 0.2
//   }
//   carouselItems = [1, 2, 3];

//   constructor(private cdr: ChangeDetectorRef) {}

//   ngAfterViewInit() {
//     this.cdr.detectChanges();
//   }


// }
