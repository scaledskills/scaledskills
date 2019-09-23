import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiPath } from '../../../_helpers/_constants/api';
import { HttpService, SharedService } from '../../../_service'
@Component({
  selector: 'app-add-training-promotions',
  templateUrl: './add-training-promotions.component.html'
})
export class AddTrainingPromotionsComponent implements OnInit {
  form: FormGroup;
  constructor(private _FormBuilder: FormBuilder, private _SharedService: SharedService, private _HttpService: HttpService) { }
  optionArray = [];
  ngOnInit() {
    this.createForm(() => { })
  }
  createForm = (callback) => {
    this.form = this._FormBuilder.group({
      trainingId: 0,
      id: 0,
      isAdvertisement: false,
      advertisementRate: false,
      isDisplayBannerHomePage: false,
      displayBannerHomePageRate: 0,
      isDisplayInCardHomePage: false,
      displayCardHomePageRate: false,
      isAffliliate: false,
      affliliateType: false,
      affliliateRate: false,
    })
    if (callback) {
      callback()
    }
  }
  get formControl() { return this.form.controls };
  getData = () => {
    const url = ApiPath.trainingSettings;
    this._HttpService.httpCall(url, 'GET', null, null).subscribe(res => {
      let resObj = res;
      Object.keys(resObj).forEach(name => {
        if (this.formControl[name]) {
          this.formControl[name].setValue(resObj[name]);
        }
      });
    })
  }
  handleSubmit = () => {
    const url = ApiPath.trainingSettings;
    let postObj = {
      ...this.form.value
    }
    this._HttpService.httpCall(url, 'POST', postObj, null).subscribe(res => {
      if (res.responseCode == 200) {
        let msgArray = [
          {
            mgs: res.responseMessege ? res.responseMessege : 'Success',
            class: 'confirmMsg'
          },
        ]
        // dialogConfig(mesage, isAction, isYes, isNo, yesText, noText, autoClose, header)
        this._SharedService.dialogConfig(msgArray, false, false, false, null, null, true, 'Sucess')
        this.getData()
      }
      else {
        let msgArray = [
          { mgs: 'Something went wrong', class: 'confirmMsg' }
        ]
        // dialogConfig(mesage, isAction, isYes, isNo, yesText, noText, autoClose, header)
        this._SharedService.dialogConfig(msgArray, false, false, false, null, null, true, 'Error')
      }
    },
      error => {
        let msgArray = [
          { mgs: error['error'] ? error['error'] : 'Something went wrong', class: 'confirmMsg' }
        ]
        // dialogConfig(mesage, isAction, isYes, isNo, yesText, noText, autoClose, header)
        this._SharedService.dialogConfig(msgArray, false, false, false, null, null, true, 'Error')
      });
  }
}
