import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-org-bank-detail',
  templateUrl: './bank-details.component.html',
})
export class OrgBankDetailsComponent implements OnInit {
  orgBankDetailForm: FormGroup;
  constructor(private _FormBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm(() => { })
  }
  createForm = (callback) => {
    this.orgBankDetailForm = this._FormBuilder.group({
      name: ['', Validators.required],
      acNumber: ['', Validators.required],
      bankName: ['', Validators.required],
      branchName: ['', Validators.required],
      ifsc: ['', Validators.required],
      gstNumber: [''],
      exemptionDocument: [''],
      panCard: [''],
      adharCard: [''],
      cheque: [''],
      accountType: ['', Validators.required],
    })
    if (callback) {
      callback()
    }
  }
  get formControl() { return this.orgBankDetailForm.controls }
  handleSubmit = () => {
    let postObj = {
      ...this.orgBankDetailForm.value
    }
    prompt('postObj', JSON.stringify(postObj))
  }

}
