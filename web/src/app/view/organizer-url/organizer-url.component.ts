import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiPath } from 'src/app/_helpers/_constants/api';
import { HttpService } from '../../_service';
@Component({
  selector: 'app-organizer-url',
  templateUrl: './organizer-url.component.html'
})
export class OrganizerUrlComponent implements OnInit {
  cars = [];
  display: boolean = false;
  isSendMesage: boolean = false;
  cities = [];
  carouselitems = [];
  userId = 0;
  isError = false;
  regUsers = [];
  reviews = [];
  upcommingTrainings = [];
  fbUrl: string = 'www.fb.com'
  pastTrainings = [];
  relatedTrainings = [];
  noRecord = [];
  urlString: string = '';
  entity = null;
  constructor(private _ActivatedRoute: ActivatedRoute, private _Router: Router, private _HttpService: HttpService) {
  }
  ngOnInit() {
    this.noRecord = [
      { msg: 'No records to display' }
    ];
    this.cars = this.noRecord;
    let url = ApiPath.generalUrl
    this._ActivatedRoute.params.subscribe((param: any) => {
      this.urlString = param.url;
      url = url.replace('{urlName}', this.urlString)
      this.getData(url)
    });
  }
  goToLink = (trainingId) => {
    this._Router.navigate(['account/trainer/training/' + trainingId + '/basic']);
  }
  getData = (url) => {
    this._HttpService.httpCall(url, 'GET', null, null).subscribe(res => {
      if (res && res.responseCode == 200) {
        this.userId = res['user'] && res['user']['id'] > 0 ? res['user']['id'] : 0;
        if (this.userId > 0) {
          this.entity = res.result ? res.result : null;
          this.fetchPastTraining();
          this.fetchUpcomingTraining();
        }
        else {
          this.entity = null;
          this.isError = true;
        }
      }
    })
  }
  fetchPastTraining = () => {
    let postObj = {
      "userId": this.userId,
      "searchText": "",
      "pageSize": 1000,
      "page": 0
    }
    let url = ApiPath.pastTraining;
    this._HttpService.httpCall(url, 'POST', postObj, null).subscribe(res => {
      this.pastTrainings = res.result.results;
    })
  }
  fetchUpcomingTraining = () => {
    let postObj = {
      "userId": this.userId,
      "searchText": "",
      "pageSize": 1000,
      "page": 0
    }
    let url = ApiPath.upcomingTraining;
    this._HttpService.httpCall(url, 'POST', postObj, null).subscribe(res => {
      this.upcommingTrainings = res.result.results;
    })
  }
  showDialog() {
    this.display = true;
  }
  showSendMesage() {
    this.isSendMesage = true;
  }
  openUrl(urlToOpen) {
    let url: string = '';
    if (!/^http[s]?:\/\//.test(urlToOpen)) {
      url += 'http://';
    }
    url += urlToOpen;
    window.open(url, '_blank');
  }
}