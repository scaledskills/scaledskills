import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrganizationComponent } from './organization.component';
import { MembersComponent } from './members/members.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { ProfileComponent } from './profile/profile.component';
import { BasicComponent } from './profile/basic/basic.component';
import { OrgAboutComponent } from './profile/about/about.component';
import {OrgSocialComponent} from './profile/social/social.component';
const routes = [
  {
    path: '', component: OrganizationComponent,
    children: [
      {path: 'profile', redirectTo:'profile/basic'},
      {
        path: 'profile', component: ProfileComponent,
        children: [
          {
            path: 'basic', component: BasicComponent,
          },
          {
            path: 'about', component: OrgAboutComponent
          },
          {
            path: 'social', component: OrgSocialComponent
          }
        ]
      },
      {
        path: 'member', component: MembersComponent,
      },
      {
        path: 'bank', component: BankDetailsComponent,
      }
    ]
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
