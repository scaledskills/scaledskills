import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { NguCarouselModule } from '@ngu/carousel';
import { AboutComponent } from './about/about.component';
import { CategoryComponent } from './home/category/category.component';
import { TermsUseComponent } from './terms-use/terms-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { HomeAddComponent } from './home/home-add/home-add.component';
import { HomeBannerComponent } from './home/home-banner/home-banner.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { NgPrimeModule } from '../_forms/prime.module'
import {SharedModule} from '../_shared/shared.module';

@NgModule({
  declarations: [HomeComponent, AboutComponent, CategoryComponent, TermsUseComponent, PrivacyPolicyComponent, HomeAddComponent, HomeBannerComponent, TestimonialComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NguCarouselModule,
    NgPrimeModule,
    SharedModule
  ]
})
export class HomeModule { }
