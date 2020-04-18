import { Component, OnInit } from '@angular/core';
import { ApiPath } from '../../../_helpers/_constants/api';
import { HttpService, SharedService } from 'src/app/_service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DownloadCSVService } from 'src/app/_service/downloadService';
@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html'
})
export class CommunicationComponent implements OnInit {
  trainingBasicForm: FormGroup;
  submitted: boolean = false;
  defaultList = [{
    "text": "Select",
    "value": "0",
    "isSelect": false
  }]
  masterData = {
    organization: [],
    trainings: [],
    userTypes: [],
    users: [],
  };
  settings;
  multiSettings;
  entity = {};
  postData = {}
  constructor(private _HttpService: HttpService, private _FormBuilder: FormBuilder, private _SharedService: SharedService, private _DownloadCSVService: DownloadCSVService) { }
  ngOnInit() {
    this.createForm(() => { })
    this.settings = { singleSelection: true, text: "Select", labelKey: "text", primaryKey: "value", noDataLabel: 'No items', enableSearchFilter: true, searchPlaceholderText: 'Search by name' };
    this.multiSettings = { singleSelection: false, text: "Select", labelKey: "text", primaryKey: "value", noDataLabel: 'No items', badgeShowLimit: 1 };
    this.getOrgData();
    this.getUserTypes('userTypes');
  }
  _httpGetMaster = (url, key, body, param, method) => {
    this._HttpService.httpCall(url, method, body, param).subscribe(res => {
      if (res.result) {
        this.masterData[key] = res.result;
        if (key == 'organization') {
          this.getTrainings('organization')
        }
      }
    })
  }
  createForm = (callback: any): void => {
    this.trainingBasicForm = this._FormBuilder.group({
      emails: ['', Validators.required],
      emailSubject: ['', Validators.required],
      emailBody: ['', Validators.required]
    })
    if (callback) {
      callback()
    }
  }
  get formControl() { return this.trainingBasicForm.controls }
  getOrgData = () => {
    let url = ApiPath.organizationList
    this._httpGetMaster(url, 'organization', null, null, 'GET')
  }
  getTrainings = (key) => {
    let ids = this.getArray(key);
    let url = ApiPath.communicationTrainings;
    let params = {
      training_Hosted: ids ? ids : 0
    }
    this._httpGetMaster(url, 'trainings', null, params, 'GET')
  }
  getUsers = (key, usersType) => {
    let ids = this.getArray('trainings');
    let url = ApiPath.communicationTrainingsUser;
    let params = {
      users: usersType
    }
    this._httpGetMaster(url, 'users', ids, params, 'POST')
  }
  getUserTypes = (key) => {
    let data = [
      {
        "text": "Registered",
        "value": "1",
        "isSelect": false
      },
      {
        "text": "Pending Registration",
        "value": "2",
        "isSelect": false
      },
      {
        "text": "Interested",
        "value": "3",
        "isSelect": false
      },
      {
        "text": "Feedback Received",
        "value": "4",
        "isSelect": false
      }
    ]
    this.masterData[key] = data;
  }
  getArray = (key) => {
    var array = [];
    this.entity[key] && this.entity[key].length > 0 && this.entity[key].forEach(element => {
      array.push(element.value)
    });
    return array
  }
  onSelect(event, key) {
    if (key == 'organization') {
      this.getTrainings('organization')
      this.entity['trainings'] = []
      this.entity['userTypes'] = [];
      this.entity['users'] = [];
    } if (key == 'trainings') {
      this.entity['userTypes'] = [];
      this.entity['users'] = [];
    } else if (key == 'userTypes') {
      this.getUsers('users', event.value);
      this.entity['users'] = [];
    }
  }
  OnDeSelect(event, key) {
    if (key == 'organization') {
      this.getTrainings('organization')
      this.entity['trainings'] = []
      this.entity['userTypes'] = [];
      this.entity['users'] = [];
    } if (key == 'trainings') {
      this.entity['userTypes'] = [];
      this.entity['users'] = [];
    } else if (key == 'userTypes') {
      this.getUsers('users', event.value);
      this.entity['users'] = [];
    }
  }
  handleSubmit = () => {
    let array = []
    this.entity['users'] && this.entity['users'].length > 0 && this.entity['users'].forEach(element => {
      array.push(element.value)
    });
    this.formControl.emails.setValue(array);
    this.postData = {
      ...this.postData,
      emails: array
    }
    if (this.trainingBasicForm.invalid) {
      this.submitted = true;
      let msgArray = [
        { mgs: 'Please complete form.', class: 'confirmMsg' }
      ]
      this._SharedService.dialogConfig(msgArray, false, false, false, null, null, false, 'Message')
    } else {
      let url = ApiPath.communicationTrainingsEmail;
      this._HttpService.httpCall(url, 'POST', this.postData, null).subscribe(res => {
        debugger
        let msgArray = [
          { mgs: res.responseMessege ? res.responseMessege : 'Success', class: 'confirmMsg' }
        ]
        this._SharedService.dialogConfig(msgArray, false, false, false, null, null, false, 'Error')
      }, error => {
        let msgArray = [
          { mgs: error['message'] ? error['message'] : 'Server Error', class: 'confirmMsg' },
        ]
        this._SharedService.dialogConfig(msgArray, false, false, false, null, null, false, 'Error')
      })
    }
  }
  download(){
    this._DownloadCSVService.downloadFile(this.masterData['users'], 'usersList');
  }
}
