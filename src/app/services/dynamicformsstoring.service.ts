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

  // In dynamicformsstoring.service.ts
  buildForm(formConfig: FormConfig): FormGroup {
    this.config = formConfig;
    const formControls: { [key: string]: any } = {};

    this.config.sections.forEach(section => {
      section.fields.forEach(field => {

        // We check for 'grouped-table' first. All other field types fall into the 'else'.
        // The old logic for 'table' has been completely removed.
        if (field.type === 'grouped-table' && field.dataColumns) {
          formControls[field.id] = this.fb.array(
            Array.from({ length: field.rows || 1 }, (_, rowIndex) => this.createTableRow(field.dataColumns || [], rowIndex))
          );
        } else {
          // Handles 'text', 'number', 'date', 'image', 'checkbox', 'dropdown', etc.
          formControls[field.id] = this.createFormControl(field);
        }
      });
    });

    this.dynamicForm = this.fb.group(formControls);

    // This saveForm call appears to be for saving the form *definition* (the blueprint).
    // I am leaving it here as it was in your code.
    
    return this.dynamicForm;
  }

  // ===================================================================
  // ====== THIS IS THE FINAL, DYNAMIC createTableRow FUNCTION =======
  // ===================================================================
  createTableRow(columns: TableDataColumn[], rowIndex: number): FormGroup {
    const rowControls: { [key: string]: any } = {};
    
    columns.forEach(column => {
      // 1. Determine the correct initial value based on a hierarchy of rules.
      let initialValue: any = ''; // Default for text, number, etc.

      if (column.initialValue === '{{rowIndex}}') {
        // Rule 1: Highest priority is the auto-increment instruction. This is dynamic.
        initialValue = rowIndex + 1;
      } else if (column.initialValue) {
        // Rule 2: Use any other static initial value if provided.
        initialValue = column.initialValue;
      } else if (column.type === 'checkbox') {
        // Rule 3: Checkboxes should default to false.
        initialValue = false;
      }

      // 2. Create the control with the determined value and the readonly flag.
      const control = this.fb.control({
        value: initialValue,
        disabled: column.readonly === true
      });

      rowControls[column.id] = control;
    });
    
    return this.fb.group(rowControls);
  }

  // ===================================================================
  // ====== NO CHANGES ARE NEEDED FOR THE FUNCTIONS BELOW ============
  // ===================================================================
  createFormControl(field: FormField) {
    let initialValue: any = '';
    if (field.type === 'checkbox') {
      initialValue = false;
    } else if (field.type === 'dropdown' && field.options) {
      initialValue = field.options[0]?.value || '';
    }

    const validators = field.required ? [Validators.required] : [];
    const control = this.fb.control(initialValue, validators);
    if (field.readonly) {
      control.disable();
    }
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
