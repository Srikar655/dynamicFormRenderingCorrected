// src/app/dynamic-form/dynamic-form.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FormConfig, FormField, TableDataColumn } from '../models/form.models';
import { InspectionService } from '../services/inspection.service';
import { ActivatedRoute } from '@angular/router';
import { DynamicformsstoringService } from '../services/dynamicformsstoring.service';

interface ValidationRules {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  required?: boolean;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  dynamicForm!: FormGroup;
  config: FormConfig | null = null;
  loading: boolean = false;
  error: string | null = null;
  reportData:any;
  format:any;
  
  private inspectionService = inject(InspectionService);
  private dynamicFormService = inject(DynamicformsstoringService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.loading = true;
    this.error = null;
    this.reportData=history.state['report'];
    // Get the form ID from route parameters
    this.route.params.subscribe(params => {
      const formId = params['id'];
      if (!formId) {
        this.error = 'No form ID provided';
        this.loading = false;
        return;
      }

      // Load the form definition
      this.dynamicFormService.getForm(formId).subscribe({
        next: (res: any) => {
          this.format=res;
          this.config = res.schema as FormConfig;
          console.log(this.config);
          this.initializeForm();
          if(this.reportData)
          {
            this.dynamicForm.patchValue(this.reportData.data);
          }
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error loading form:', err);
          this.error = 'Failed to load form. Please try again.';
          this.loading = false;
        }
      });
    });
  }

  private initializeForm() {
    if (!this.config) return;
    this.dynamicForm=this.dynamicFormService.buildForm(this.config) as FormGroup;
    // Create form group based on the configuration
    
  }

  getFormArray(fieldId: string): FormArray {
    return this.dynamicForm.get(fieldId) as FormArray;
  }

  isFieldRequired(field: FormField): boolean {
    return field.required || false;
  }

  getFieldError(fieldId: string): string | null {
    const control = this.dynamicForm.get(fieldId);
    if (!control || !control.errors || !control.touched) return null;

    if (control.errors['required']) return 'This field is required';
    if (control.errors['pattern']) return 'Invalid format';
    if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    if (control.errors['maxlength']) return `Maximum length is ${control.errors['maxlength'].requiredLength}`;
    if (control.errors['min']) return `Minimum value is ${control.errors['min'].min}`;
    if (control.errors['max']) return `Maximum value is ${control.errors['max'].max}`;

    return 'Invalid value';
  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      console.log(this.dynamicForm.value);
      if(this.reportData)
      {
        this.inspectionService.update(this.format.id,this.reportData.id,this.dynamicForm.getRawValue()).subscribe({
          next:(res:any)=>
          {
            console.log(res);
          },
          error:(err:any)=>{
            console.log(err);
          }
        })
      }
      else{
        this.inspectionService.saveReportData(this.format.id,this.dynamicForm.getRawValue()).subscribe({
          next:(res:any)=>{
            console.log(res);
          },
          error:(err:any)=>{
            console.log(err);
          }
        })
      }
      // Handle form submission
    }
  }

  onImageError(event: any): void { console.error('Image failed to load:', event.target.src); }
  onImageLoad(event: any): void { console.log('Image loaded successfully:', event.target.src); }
}