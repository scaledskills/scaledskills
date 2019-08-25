import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-training-basic',
  templateUrl: './add-training-basic.component.html',
})
export class AddTrainingBasicComponent implements OnInit {
  trainingBasicForm: FormGroup;
  baseUrl='http://scaledskills.com/t/';
  cities=[];
  trainingForList=[]

  constructor(private _FormBuilder: FormBuilder) {
    this.cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
  ];
  this.trainingForList=[
    {name: 'Individual', code: '1'},
      {name: 'Organization', code: '2'},
  ]
  }
  ngOnInit() {
    this.createForm(() => { })
  }
  createForm = (callback: any): void => {
    this.trainingBasicForm = this._FormBuilder.group({
      trainingName: ['', Validators.required],
      baseUrl: ['http://scaledskills.com/o/', Validators.required],
      trainingUrl: ['', Validators.required],
      trainingFor: ['', Validators.required],
      organization: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      timeZone: ['', Validators.required],
    })
    if (callback) {
      callback()
    }
  }

  get formControl() { return this.trainingBasicForm.controls }
  handleSubmit = () => {
    let postData = {
      ...this.trainingBasicForm.value
    }
    prompt('postData', JSON.stringify(postData))
  }
}
