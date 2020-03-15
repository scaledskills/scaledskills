import { Component, OnInit } from '@angular/core';
import * as service from '../../../_service';
import { ApiPath } from '../../../_helpers/_constants/api'
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {
  page: number = 0;
  pageSize: number = 16;
  totalTraining = 0
  RTList = [];
  searchText: string = ''
  currentLength = 0;
  userInfo: any = {};
  isLoggedIn: boolean = false;
  constructor(private _HttpService: service.HttpService) { }
  ngOnInit() {
    this.getData();
  }
  getData = () => {
    let postObj = {
      "userId": 0,
      "searchText": this.searchText,
      "pageSize": this.pageSize,
      "page": this.page
    }
    let url = ApiPath.homeRunningTraining
    this._HttpService.httpCall(url, 'POST', postObj, null).subscribe(res => {
      this.RTList = [];
      this.RTList = res.result.results;
      this.currentLength = this.RTList ? this.RTList.length : 0;
      this.totalTraining = res.result.totalCount;
    })
  }
  funNext = (page) => {
    this.page = page + 1;
    this.getData()
  }
  funPrevious = (page) => {
    this.page = page - 1;
    this.getData()
  }
  onSearchChange(searchValue) {
    this.searchText = searchValue;
    this.page = 0;
    this.currentLength = 0;
  }
}
