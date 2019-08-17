import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module'
import { ProfileComponent } from './profile.component';
import { BasicComponent } from './basic/basic.component';
import { FormModule } from '../../_forms/form/form.module';
import { CredentialsComponent } from './credentials/credentials.component';
import { KeywordsComponent } from './keywords/keywords.component';
import { AboutComponent } from './about/about.component';
import { CertificationsComponent } from './certifications/certifications.component';
import { SocialComponent } from './social/social.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
@NgModule({
  declarations: [ProfileComponent, BasicComponent, CredentialsComponent, KeywordsComponent, AboutComponent, CertificationsComponent, SocialComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormModule,
    AngularEditorModule
  ]
})
export class ProfileModule { }
