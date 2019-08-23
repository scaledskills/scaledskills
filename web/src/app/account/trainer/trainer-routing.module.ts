import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TrainerComponent } from './trainer.component'
import { TrainerProfileComponent } from './trainer-profile/trainer-profile.component';
import { OrgBasicComponent } from '../../_shared/profile/org-basic/org-basic.component';
import { OrgAboutComponent } from '../../_shared/profile/org-about/org-about.component';
import { SocialComponent } from '../../_shared/profile/social/social.component';
import { CredentialsComponent } from '../../_shared/profile/credentials/credentials.component';
import { KeywordsComponent } from '../../_shared/profile/keywords/keywords.component';
import { CertificationsComponent } from '../../_shared/profile/certifications/certifications.component';
const routes = [
  {
    path: '', component: TrainerComponent,
    children: [
      { path: '', redirectTo: 'profile' },
      {
        path: 'profile', component: TrainerProfileComponent,
        children: [
          { path: '', redirectTo: 'basic', pathMatch: 'full' },
          { path: 'basic', component: OrgBasicComponent },
          { path: 'password', component: CredentialsComponent },
          { path: 'keyword', component: KeywordsComponent },
          { path: 'about', component: OrgAboutComponent },
          { path: 'certificate', component: CertificationsComponent },
          { path: 'social', component: SocialComponent },
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountTrainerRoutingModule { }
