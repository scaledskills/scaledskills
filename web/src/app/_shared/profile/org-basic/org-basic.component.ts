import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService, SharedService } from '../../../_service';
import { first } from 'rxjs/operators';
import { ApiPath } from '../../../_helpers/_constants/api';
@Component({
  selector: 'app-org-basic',
  templateUrl: './org-basic.component.html',
})
export class OrgBasicComponent implements OnInit {
  orgBasicForm: FormGroup;
  submitted: boolean = false;
  fileData = null;
  selectedCountry = [];
  selectedState = [];
  settings = {};
  defaultList = [];
  constructor(private _FormBuilder: FormBuilder, private _HttpService: HttpService, private _SharedService: SharedService) { }
  ngOnInit() {
    this.createForm(() => {
      this.getCountryList();
      this.defaultList = [{
        "text": "Select",
        "value": "0",
        "isSelect": false
      }];
      this.settings = { singleSelection: true, text: "Select", labelKey: "text", primaryKey: "value", noDataLabel: 'No items' };
      this.fetchData()
    })
  }
  createForm = (callback: any): void => {
    this.orgBasicForm = this._FormBuilder.group({
      name: ['', Validators.required],
      ownerName: ['', Validators.required],
      baseUrl: ['http://scaledskills.com/o/'],
      profileUrl: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      gst: ['', [Validators.minLength(15), Validators.maxLength(15)]],
      panNumber: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      idProof: ['', [Validators.required]],
      address: this._FormBuilder.group({
        address1: [''],
        address2: [''],
        address3: [''],
        zipCode: [''],
        street: [''],
        countryId: [''],
        countryObj: [''],
        stateId: [''],
        stateObj: [''],
        city: ['']
      }),
    })
    if (callback) {
      callback()
    }
  }
  get formControl() { return this.orgBasicForm.controls };
  fetchData = () => {
    let url = ApiPath.Organization;
    this._HttpService.httpCall(url, 'GET', null, null).pipe(first()).subscribe(res => {
      if (res.responseCode == 200) {
        let dataObj = res.result;
        Object.keys(dataObj).forEach(name => {
          if (this.formControl[name]) {
            if (name != 'address') {
              this.formControl[name].setValue(dataObj[name]);
            }
          }
        });
        this.orgBasicForm.get(['address', 'address1']).setValue(dataObj.address && dataObj.address.address1 ? dataObj.address.address1 : 'NA');
        this.orgBasicForm.get(['address', 'address2']).setValue(dataObj.address && dataObj.address.address2 ? dataObj.address.address2 : 'NA');
        this.orgBasicForm.get(['address', 'address3']).setValue(dataObj.address && dataObj.address.address3 ? dataObj.address.address3 : 'NA');
        this.orgBasicForm.get(['address', 'city']).setValue(dataObj.address && dataObj.address.city ? dataObj.address.city : 'NA');
        this.orgBasicForm.get(['address', 'zipCode']).setValue(dataObj.address && dataObj.address.zipCode ? dataObj.address.zipCode : 'NA');
        this.orgBasicForm.get(['address', 'street']).setValue(dataObj.address && dataObj.address.street ? dataObj.address.street : 'NA');
        this.orgBasicForm.get(['address', 'countryId']).setValue(dataObj.address && dataObj.address.countryId ? dataObj.address.countryId : 'NA');
        this.orgBasicForm.get(['address', 'stateId']).setValue(dataObj.address && dataObj.address.stateId ? dataObj.address.stateId : 'NA');
        this.orgBasicForm.get(['address', 'countryObj']).setValue(dataObj.address && dataObj.address.countryObj ? dataObj.address.countryObj : 'NA');
        this.orgBasicForm.get(['address', 'stateObj']).setValue(dataObj.address && dataObj.address.stateObj ? dataObj.address.stateObj : 'NA');
        this.selectedCountry = [dataObj.address && dataObj.address.countryObj ? dataObj.address.countryObj : this.defaultList];
        this.selectedState = [dataObj.address && dataObj.address.stateObj ? dataObj.address.stateObj : this.defaultList];
        if (dataObj.address && dataObj.address.countryId > 0) {
          let id = this.orgBasicForm.get(['address', 'countryId']).value
          this.getStateList(id)
        }
      }
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
  onChangeCountry(event) {
    let id = event.value
    this.orgBasicForm.get(['address', 'countryId']).setValue(event.value)
    this.getStateList(id)
  }
  onChangeState(event) {
    this.orgBasicForm.get(['address', 'stateId']).setValue(event.value)
  }
  myUploader = (event, control) => {
    this.fileData = <File>event.files[0];
    let url = ApiPath.documentUpload
    const formData = new FormData();
    formData.append('file', this.fileData);
    this._HttpService.httpCall(url, 'POST', formData, null).subscribe(res => {
      this.formControl[control].setValue(res.result)
    })
  }
  handleSubmit = () => {
    const url = ApiPath.Organization;
    let postObj = {
      ...this.orgBasicForm.value
    }
    postObj.address.countryObj = postObj.address.countryObj[0];
    postObj.address.stateObj = postObj.address.stateObj[0];
    if (this.orgBasicForm.valid) {
      this.submitted = false;
      this._HttpService.httpCall(url, 'PUT', postObj, null).subscribe(res => {
        if (res.result) {
          let msgArray = [
            {
              mgs: res.responseMessege ? res.responseMessege : 'Success',
              class: 'confirmMsg'
            },
          ]
          this._SharedService.dialogConfig(msgArray, false, false, false, null, null, true, 'Sucess');
          this.fetchData();
        } else {
          let msgArray = [
            { mgs: 'Something went wrong', class: 'confirmMsg' }
          ]
          this._SharedService.dialogConfig(msgArray, false, false, false, null, null, true, 'Error')
        }
      }, error => {
        let msgArray = [
          { mgs: error['error'] ? error['error'] : 'Something went wrong', class: 'confirmMsg' }
        ]
        this._SharedService.dialogConfig(msgArray, false, false, false, null, null, true, 'Error')
      })
    } else {
      this.submitted = true;
      let msgArray = [
        { mgs: 'Please complete form', class: 'confirmMsg' },
      ]
      this._SharedService.dialogConfig(msgArray, false, false, false, null, null, true, 'Error')
    }
  }
}
