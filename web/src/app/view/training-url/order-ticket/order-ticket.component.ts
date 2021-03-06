import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiPath } from 'src/app/_helpers/_constants/api';
import { HttpService, AuthenticationService, SharedService } from '../../../_service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-order-ticket',
  templateUrl: './order-ticket.component.html'
})
export class OrderTicketComponent implements OnInit {
  urlString: string = '';
  ticketList = []
  selectedTickets = [];
  referralCode: '';
  orderId = '';
  submitted = false;
  currentDate = new Date();
  currentDate2;
  currentDate3;
  inc = 1000 * 60 * 60 // an hour
  dec = (1000 * 60 * 60) * -1 // an hour

  constructor(private _location: Location, private _ActivatedRoute: ActivatedRoute, private _HttpService: HttpService, private _SharedService: SharedService, private _Router: Router) { }
  ngOnInit() {
    this.currentDate2 = this.currentDate.getTime() + this.inc;
    this.currentDate3 = this.currentDate.getTime() + this.dec;
    let url = ApiPath.trainingTicket;
    this._ActivatedRoute.params.subscribe((param: any) => {
      this.urlString = param.id;
      url = url.replace('{TrainingId}', this.urlString.toString())
      this.fetchTickets(url)
    });
    this._ActivatedRoute.queryParams.subscribe(params => {
      this.referralCode = params.refCode ? params.refCode : null
    });
  }
  fetchTickets = (url) => {
    this._HttpService.httpCall(url, 'GET', null, null).subscribe(res => {
      if (res && res['responseCode'] == 200) {
        this.ticketList = res.result;
        this.ticketList.map((x) => {
          x.orderQty = 1;
          x.isAdded = false;
          x.maxBooking = x.maxBooking ? x.maxBooking : x.availableQty
        })
      }
    })
  }
  handleDate = (end) => {
    let endDate = new Date(end);
    var diffTime = (endDate.getTime() - this.currentDate.getTime()) / 1000;
    let seconds = Math.floor((diffTime));
    return seconds >= 0 ? true : false
  }
  handleQty = (type, item) => {
    if (type == 1) {
      item.orderQty = item.orderQty - 1
    } else {
      item.orderQty = item.orderQty + 1
    }
  }
  onBlurMethod = (item) => {
    if (!item.orderQty) {
      item.orderQty = item.minBooking
    } else if (item.orderQty > item.availableQty) {
      item.orderQty = item.availableQty
    } else if (item.orderQty < item.minBooking) {
      item.orderQty = item.minBooking
    }
  }
  addItem = (item) => {
    item.isAdded = !item.isAdded;
    this.selectedTickets = this.ticketList.filter(x => x.isAdded);
  }
  orderItem = () => {
    let tempItem = [];
    let selectedTickets = [];
    this.ticketList.filter((x) => {
      if (x.isAdded) {
        selectedTickets.push({
          "item": {},
          "itemId": x.id,
          "qty": x.orderQty,
          "unitPrice": x.paymentCharge,
          "totalPrice": x.paymentCharge * x.orderQty
        })
      }
    });
    tempItem = selectedTickets;
    return tempItem
  }
  backClicked = () => {
    let returnUrl = localStorage.getItem('returnurl') || '/';
    if (this.referralCode) {
      this._Router.navigate(['/' + returnUrl], { queryParams: { refCode: this.referralCode } });
    } else {
      this._Router.navigate([returnUrl]);
    }
  }
  handleSubmit = () => {
    let postObj = {
      "orderAppId": "",
      "address": "",
      "description": "",
      "totalAmount": 0,
      'referralCode': this.referralCode,
      "items": this.orderItem()
    }
    if (postObj.items.length > 0) {
      this.submitted = false
    } else {
      this.submitted = true
    }
    if (!this.submitted) {
      let url = ApiPath.orderTicket
      this._HttpService.httpCall(url, 'POST', postObj, null).subscribe(res => {
        if (res && res.responseCode == 406) {
          let msgArray = [
            { mgs: res && res.responseMessege ? res.responseMessege : 'Something went wrong', class: 'confirmMsg' }
          ]
          this._SharedService.dialogConfig(msgArray, false, false, false, null, null, false, 'Message')
        } else if (res && res.responseCode == 200) {
          /* success  */
          this.orderId = res['result']
          if (this.referralCode) {
            this._Router.navigate(['/orderDetail', this.orderId], { queryParams: { refCode: this.referralCode } })
          } else {
            this._Router.navigate(['/orderDetail', this.orderId])
          }

        } else {
          /* any other error */
          let msgArray = [
            { mgs: res && res.responseMessege ? res.responseMessege : 'Something went wrong', class: 'confirmMsg' }
          ]
          this._SharedService.dialogConfig(msgArray, false, false, false, null, null, false, 'Error')
        }
      })
    }
  }
}
