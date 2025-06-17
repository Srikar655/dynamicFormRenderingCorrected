import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormConfig, FormField, TableDataColumn } from '../models/form.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DynamicformsstoringService {
  private config!:FormConfig;
  dynamicForm!: FormGroup;
  apiUrl:string='https://localhost:7227/api/FormDefinitions';
  constructor(private httpClinet:HttpClient,private fb: FormBuilder) { }

  buildForm(formConfig:FormConfig) {
    this.config=formConfig;
    const formControls: { [key: string]: any } = {};

    this.config.sections.forEach(section => {
      section.fields.forEach(field => {
        
        if (field.type === 'table' && field.columns) {
          formControls[field.id] = this.fb.array(
            Array.from({ length: field.rows || 1 }, (_, i) => {
              const rowControls: { [key: string]: any } = {};
              field.columns!.forEach(column => {
                rowControls[column.id] = this.fb.control(column.id === 'serialNo' ? i + 1 : '');
              });
              return this.fb.group(rowControls);
            })
          );
        } else if (field.type === 'grouped-table' && field.dataColumns) {
            formControls[field.id] = this.fb.array(
            // CORRECTED: Added a fallback empty array to prevent type errors
            Array.from({ length: field.rows || 1 }, (_, rowIndex) => this.createTableRow(field.dataColumns || [], rowIndex))
          );
        } else {
          formControls[field.id] = this.createFormControl(field);
        }
      });
    });

    this.dynamicForm = this.fb.group(formControls);
    return this.dynamicForm;
  }
  createTableRow(columns: TableDataColumn[], rowIndex: number): FormGroup {
    const rowControls: { [key: string]: any } = {};
    columns.forEach(column => {
      let initialValue: any = '';
      if (column.readonly && column.id === 'bladeNo') { initialValue = rowIndex + 1; } 
      else if (column.type === 'checkbox') { initialValue = false; }
      rowControls[column.id] = this.fb.control(initialValue);
    });
    return this.fb.group(rowControls);
  }

  createFormControl(field: FormField) {
    let initialValue: any = '';
    // CORRECTED: Removed check for 'select' to resolve the type error. `dropdown` is what you use.
    if (field.type === 'checkbox') { initialValue = false; }
    else if (field.type === 'dropdown' && field.options) {
      initialValue = field.options[0]?.value || '';
    }

    const validators = field.required ? [Validators.required] : [];
    const control = this.fb.control(initialValue, validators);
    if(field.readonly) { control.disable(); }
    return control;
  }
  saveForm(dynamicForm:FormGroup)
  {
    return this.httpClinet.post(this.apiUrl,dynamicForm);
  }
  getForm(id:number)
  {
    return this.httpClinet.get(this.apiUrl+'/'+id);
  }
  getFormsList()
  {
    return this.httpClinet.get(this.apiUrl);
  }
}
