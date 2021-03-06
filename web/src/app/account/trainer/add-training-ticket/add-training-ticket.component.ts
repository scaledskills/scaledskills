import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { ApiPath } from '../../../_helpers/_constants/api';
import { HttpService, SharedService } from '../../../_service'
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-training-ticket',
  templateUrl: './add-training-ticket.component.html',
  styles: [`
        @media screen and (max-width: 40em) {
            :host ::ng-deep .ui-dialog {
                width: 75vw !important;
            }
        }
    `]
})
export class AddTrainingTicketComponent implements OnInit {
  formElement: FormGroup;
  ticketId = 0;
  paymentDetails = [];
  paymentBreakup: null;
  countryList = [];
  display: boolean;
  stateList = [];
  trainingBasicData = null;
  curentYear = (new Date()).getFullYear();
  submitted: boolean = false;
  trainingId = 0;
  ticektSaleMaxDate;
  addTicketForm = false;
  defaultList = [{
    "text": "Select",
    "value": "0",
  }];
  selectedTicketType = [];
  ticketTypeList = [{
    "text": "Free",
    "value": "1",
  },
  {
    "text": "Paid",
    "value": "2",
  }
  ];
  prevState;
  settings;
  startDate = new FormControl();
  startTime = new FormControl();
  endDate = new FormControl();
  endTime = new FormControl();
  trainingData = [];
  displayNoRecord = false;
  description: '';
  msgForAtendee: '';
  constructor(private _FormBuilder: FormBuilder, private _HttpService: HttpService, private _SharedService: SharedService, private _ActivatedRoute: ActivatedRoute, private _Router: Router) { }
  ngOnInit() {
    this._ActivatedRoute.parent.params.subscribe((param: any) => {
      this.trainingId = param.id;
      if (this.trainingId == 0) {
        let msgArray = [
          { mgs: 'Sorry! You have to create a training first', class: 'confirmMsg' },
        ]
        this._SharedService.dialogConfig(msgArray, true, true, false, 'OKAY', 'CANCEL', false, 'Alert').subscribe(res => {
          if (res == 1) {
            this._Router.navigate(['account/trainer/training/0/basic']);
          }
        })
        return
      } else {
        this.getData()
      }
    });
    this.getTrainingData(this.trainingId)
    this.createForm(() => {
      this.settings = { singleSelection: true, text: "Select", labelKey: "text", primaryKey: "value", noDataLabel: 'No items' };
      this.selectedTicketType = this.defaultList;
      this.startDate.setValue('');
      this.startTime.setValue('');
      this.endDate.setValue('');
      this.endTime.setValue('');
      this.getCountryList();
    })
  }
  createForm = (callback) => {
    this.formElement = this._FormBuilder.group({
      name: ['', Validators.required],
      qty: ['', Validators.required],
      minBooking: ['1', [Validators.required, Validators.min(1)]],
      maxBooking: ['1',],
      ticketType: [1, [Validators.required, Validators.min(1)]],
      ticketTypeObj: [''],
      paymentCharge: ['0', [Validators.required]],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      description: [''],
      msgForAtendee: [''],
      id: 0
    })
    if (callback) {
      callback()
    }
  }
  get formControl() { return this.formElement.controls };
  getTrainingData = (id) => {
    let url = ApiPath.getTraining
    url = url.replace('{id}', id)
    this._HttpService.httpCall(url, 'GET', null, null).subscribe(res => {
      if (res.result) {
        this.trainingBasicData = res.result;
        this.ticektSaleMaxDate = new Date(this.trainingBasicData.endDate);
      }
    })
  }
  ticketPreview = () => {
    let url = ApiPath.ticketPreview;
    let data = {
      "totalAmount": this.formControl.paymentCharge.value,
      "paymentDetails": this.paymentDetails
    }
    this._HttpService.httpCall(url, 'POST', data, null).subscribe(res => {
      this.paymentBreakup = res.result
    })
  }
  getMaster = (url, masterCollection) => {
    this._HttpService.httpCall(url, 'GET', null, null).pipe(first()).subscribe(res => {
      if (res.responseCode == 200) {
        this[masterCollection] = res.result
      }
    })
  }
  getCountryList = () => {
    let url = ApiPath.globalCountry;
    this.getMaster(url, 'countryList')
  }
  getStateList = (id) => {
    const url = ApiPath.globalState + '/' + id;
    this.getMaster(url, 'stateList')
  }
  onTypeChange(event) {
    this.formControl['ticketType'].setValue(event.value)
    if (event.value == 1) {
      this.formControl['paymentCharge'].setValue(0)
    } else {
      this.getTicketFee()
    }
  }
  getTicketFee = () => {
    let url = ApiPath.ticketFee;
    url = url.replace('{ticketId}', this.ticketId.toString())
    this._HttpService.httpCall(url, 'GET', null, null).subscribe(res => {
      if (res && res.responseCode == 200) {
        this.paymentDetails = res.result;
        this.paymentDetails.map(x => {
          x.ticketId = this.ticketId
        })
        this.ticketPreview();
      } else {
        this.paymentDetails = []
      }
    })
  }
  OnItemDeSelect(item: any) {
    this.formControl['ticketType'].setValue('')
  }
  getData = () => {
    this.displayNoRecord = false;
    let url = ApiPath.trainingTicket;
    url = url.replace('{TrainingId}', this.trainingId.toString())
    this._HttpService.httpCall(url, 'GET', null, null).subscribe(res => {
      this.displayNoRecord = true;
      this.trainingData = res.result;
    })
  }
  resetForm(formGroup: FormGroup, addTicketForm) {
    let control: AbstractControl = null;
    formGroup.reset();
    formGroup.markAsUntouched();

    Object.keys(formGroup.controls).forEach((name) => {
      control = formGroup.controls[name];
      control.setErrors(null);
    });
    this.formControl.minBooking.setValue(1);
    this.formControl.maxBooking.setValue(1);
    this.selectedTicketType = this.defaultList;
    this.startDate.setValue('');
    this.startTime.setValue('');
    this.formControl.startDate.setValue('');
    this.formControl.startTime.setValue('');
    this.endDate.setValue('');
    this.endTime.setValue('');
    this.description = '';
    this.msgForAtendee = '';
    this.formControl.endDate.setValue('');
    this.formControl.endTime.setValue('');
    this.paymentDetails = [];
    this.formControl.id.setValue(0);
    this.addTicketForm = addTicketForm;
    this.submitted = false;
  }
  setDate = (dataObj) => {
    this.startDate.setValue(new Date(dataObj.startDate));
    this.startTime.setValue(new Date(dataObj.startDate));
    this.formControl.startDate.setValue(dataObj.startDate);
    this.formControl.startTime.setValue(dataObj.startDate);
    this.endDate.setValue(new Date(dataObj.endDate));
    this.endTime.setValue(new Date(dataObj.endDate));
    this.formControl.endDate.setValue(dataObj.endDate);
    this.formControl.endTime.setValue(dataObj.endDate);
  }
  setDropdown = (dataObj) => {
    let ticketTypeObj = this.ticketTypeList.filter(x => x.value == dataObj.ticketType)
    this.selectedTicketType = ticketTypeObj;
    this.formControl['ticketTypeObj'].setValue(ticketTypeObj);
  }
  editTrainingTicket = (id) => {
    let url = ApiPath.trainingTicket;
    url = url.replace('{TrainingId}', this.trainingId.toString()) + '/' + id
    this._HttpService.httpCall(url, 'GET', null, null).subscribe(res => {
      this.prevState = res.result;
      this.addTicketForm = true;
      let dataObj = res.result;
      this.description = dataObj.description;
      this.msgForAtendee = dataObj.msgForAtendee;
      this.ticketId = dataObj.id;
      if (dataObj.ticketType == 2) {
        this.getTicketFee()
      }
      Object.keys(dataObj).forEach(name => {
        if (this.formControl[name]) {
          if (name != 'address') {
            this.formControl[name].setValue(dataObj[name]);
          }
        }
      });
      if (dataObj.ticketType == 1) {
        this.selectedTicketType = this.defaultList;
        this.formControl['ticketTypeObj'].setValue(this.defaultList);
      } else {
        let data = [{
          "text": "Paid",
          "value": "2",
        }]
        this.selectedTicketType = data;
        this.formControl['ticketTypeObj'].setValue(data);
      }
      this.setDate(dataObj)
    })
  }
  addFormHandle = () => {
    this.resetForm(this.formElement, true)
  }
  handleCancel = () => {
    let msgArray = [
      { mgs: 'Are you sure, you want to cancel ?', class: 'confirmMsg' },
      { mgs: 'Unsaved changes will not be saved.', class: 'subMsg' },
    ]
    this._SharedService.dialogConfig(msgArray, true, true, true, 'YES', 'CANCEL', false, 'Success').subscribe(res => {
      if (res == 1) {
        this.resetForm(this.formElement, null)
      }
    })
  }
  handleSubmit = () => {
    this.submitted = true;
    let url = ApiPath.trainingTicket;
    url = url.replace('{TrainingId}', this.trainingId.toString())
    let startDate = this.startDate.value ? this.startDate.value.toLocaleString() : '';
    let startTime = this.startTime.value ? this.startTime.value.toLocaleString() : '';
    let startDateTime = startDate.split(',')[0] + ',' + startTime.split(',')[1]
    this.formControl.startTime.setValue(startTime);
    this.formControl.startDate.setValue(startDateTime);
    let endDate = this.endDate.value ? this.endDate.value.toLocaleString() : '';
    let endTime = this.endTime.value ? this.endTime.value.toLocaleString() : '';
    let endDateTime = endDate.split(',')[0] + ',' + endTime.split(',')[1]
    this.formControl.endDate.setValue(endDateTime);
    this.formControl.endTime.setValue(endTime);
    let postObj = {
      ...this.formElement.value
    }
    postObj.id=postObj.id?postObj.id:0
    postObj.description = this.description;
    postObj.msgForAtendee = this.msgForAtendee;
    postObj.ticketPaymentDetails = this.paymentDetails;
    if (this.formElement.valid) {
      if (this.formControl.minBooking.value > this.formControl.maxBooking.value) {
        let msgArray = [
          { mgs: 'Max qty should be greather than Min.', class: 'confirmMsg' },
        ]
        this._SharedService.dialogConfig(msgArray, false, false, false, null, null, false, 'Error')
        this.submitted = true;
      } else {
        this.submitted = false;
        this._HttpService.httpCall(url, 'POST', postObj, null).subscribe(res => {
          if (res.responseCode == 200) {
            let msgArray = [
              { mgs: res.responseMessege ? res.responseMessege : 'Success', class: 'confirmMsg' },
              { mgs: 'Do you want to create another ticket?.', class: 'subMsg' },
            ]
            this._SharedService.dialogConfig(msgArray, true, true, true, 'YES', 'NO', false, 'Success').subscribe(res => {
              if (res == 1) {
                this.resetForm(this.formElement, true)
              } else {
                this.resetForm(this.formElement, false)
                this.getData()
              }
            })
          }
          else {
            let msgArray = [
              { mgs: 'Something went wrong', class: 'confirmMsg' }
            ]
            // dialogConfig(mesage, isAction, isYes, isNo, yesText, noText, autoClose, header)
            this._SharedService.dialogConfig(msgArray, false, false, false, null, null, false, 'Error')
            this.resetForm(this.formElement, false)
          }
        },
          error => {
            let msgArray = [
              { mgs: error['message'] ? error['message'] : 'Server Error', class: 'confirmMsg' },
            ]
            // dialogConfig(mesage, isAction, isYes, isNo, yesText, noText, autoClose, header)
            this._SharedService.dialogConfig(msgArray, false, false, false, null, null, false, 'Error')
          });
        this.resetForm(this.formElement, true)
      }
    } else {
      let msgArray = [
        { mgs: 'Please complete form', class: 'confirmMsg' },
      ]
      this._SharedService.dialogConfig(msgArray, false, false, false, null, null, false, 'Error')
      this.submitted = true;
    }
  }
  showDialog() {
    this.display = true;
  }
}
