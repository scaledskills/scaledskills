import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';
@Component({
  selector: 'app-feature-training',
  templateUrl: './feature-training.component.html'
})
export class FeatureTrainingComponent implements AfterViewInit {
  slideNo = 0;
  withAnim = true;
  resetAnim = true;
  TutorsCarouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 2, md: 2, lg: 2, all: 0 },
    load: 2,
    interval: { timing: 3000, initialDelay: 1000 },
    loop: false,
    touch: true,
    velocity: 0.2
  }
  TutorslItems = [1, 2, 3, 4, 5, 6];
  constructor(private cdr: ChangeDetectorRef) { }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
