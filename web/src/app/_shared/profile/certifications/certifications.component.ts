import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpService, SharedService } from '../../../_service'
import { ApiPath } from '../../../_helpers/_constants/api';
@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.component.html',
})
export class CertificationsComponent implements OnInit {
  certificatesForm: FormGroup;
  loadGrid: boolean = false;
  constructor(private _FormBuilder: FormBuilder, private _HttpService: HttpService, private _SharedService: SharedService) { }
  submitted: boolean = false;
  minDate: Date;
  maxDate: Date;
  certificationFrom = new FormControl();
  certificationTo = new FormControl();
  certificationUrl = '';
  msgDialog=false;
  listData = []
  ngOnInit() {
    this.createForm(() => {
      this.certificationUrl = ApiPath.trainerCertificate;
      this.certificationFrom.setValue(new Date());
      this.certificationTo.setValue(new Date());
      this.getCertificationData();
    })
  }
  createForm = (callback) => {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.certificatesForm = this._FormBuilder.group({
      name: ['', Validators.required],
      url: ['', [Validators.pattern(reg)]],
      authority: ['', [Validators.required]],
      from: [this.certificationFrom.value, [Validators.required]],
      to: [this.certificationTo.value, [Validators.required]],
      id: [0],
      isExpired: [false],
    })
    if (callback) {
      callback()
    }
  }
  get formControl() { return this.certificatesForm.controls }
  getCertificationData = () => {
    this._HttpService.httpCall(this.certificationUrl, 'GET', null, null).subscribe(res => {
      this.loadGrid = true;
      if (res.responseCode == 200) {
        this.listData = res.result;
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
  }
  handleEdit = (item) => {
    Object.keys(item).forEach(name => {
      if (this.formControl[name]) {
        this.formControl[name].setValue(item[name]);
      }
    });
    this.certificationFrom.setValue(new Date(item.from));
    this.certificationTo.setValue(new Date(item.to));
  }
  handleView = (url) => {
    window.open('http://' + url, "_blank");
  }
  handleRemove = () => {
  }
  handleSubmit = () => {
    this.formControl.from.setValue(this.certificationFrom.value ? this.certificationFrom.value : '');
    this.formControl.to.setValue(this.certificationTo.value ? this.certificationTo.value : '');
    let postObj = {
      ...this.certificatesForm.value
    }
    if (this.certificatesForm.invalid) {
      this.submitted = true;
      let msgArray = [
        { mgs: 'Please complete form', class: 'confirmMsg' },
      ]
      this._SharedService.dialogConfig(msgArray, false, false, false, null, null, true, 'Error')
    } else {
      this._HttpService.httpCall(this.certificationUrl, 'POST', postObj, null).subscribe(res => {
        if (res.result) {
          let msgArray = [
            {
              mgs: res.responseMessege ? res.responseMessege : 'Success',
              class: 'confirmMsg'
            },
          ]
          this._SharedService.dialogConfig(msgArray, false, false, false, null, null, true, 'Sucess');
          this.getCertificationData()
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
    }
  }
}
