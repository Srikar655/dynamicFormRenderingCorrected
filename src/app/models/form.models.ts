// src/app/models/form.models.ts

export interface HeaderCell {
  label: string;
  colspan?: number;
  rowspan?: number;
  className?: string;
}

export interface TableDataColumn {
  id: string;
  type: 'text' | 'number' | 'checkbox' | 'dropdown' | 'radio';
  readonly?: boolean;
  placeholder?: string;
  step?: string;
  options?: { value: string; label:string }[];
  className?: string;
  initialValue?: any;
}

export interface TableColumn {
  id: string;
  label: string;
  type: 'text' | 'number' | 'checkbox' | 'dropdown' | 'radio';
  readonly?: boolean;
  placeholder?: string;
  step?: string;
  options?: { value: string; label: string }[];
  initialValue?: any;
}

export interface GroupedTableField {
  rows?: number;
  headerRows?: HeaderCell[][]; 
  dataColumns?: TableDataColumn[];
}

export interface FormField extends GroupedTableField {
  id: string;
  label: string;
  // NOTE: 'table' type removed as it's no longer needed.
  type: 'text' | 'number' | 'date' | 'radio' | 'image' | 'grouped-table' | 'checkbox' | 'dropdown';
  required?: boolean;
  placeholder?: string;
  step?: string;
  readonly?: boolean;
  options?: { value: string; label: string }[];
  columns?: TableColumn[];
  imagePath?: string;
  imageAlt?: string;
  imageWidth?: string;
  imageHeight?: string;
  validationRules?: ValidationRules;
  // ADD THIS NEW PROPERTY
  layout?: {
    gridColumn?: string;
    gridRow?: string;
  };
}

export interface ValidationRules {
  [key: string]: any;
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
  // ADD THIS NEW PROPERTY
  layout?: {
    gridTemplateColumns?: string;
    gap?: string;
  };
}

export interface BusinessRules {
  tolerances: { [key: string]: { min: number; max: number; nominal: number; }; };
  decisionCriteria: { repair: DecisionCriteria; replace: DecisionCriteria; reject: DecisionCriteria; };
}

export interface DecisionCriteria {
  description: string;
  conditions: string[];
}

export interface FormConfig {
  title: string;
  formId: string;
  revision: string;
  sections: FormSection[];
  businessRules?: BusinessRules;
}

export interface FormData {
  [key: string]: any;
}

export interface InspectionResult {
  decision: 'repair' | 'replace' | 'reject';
  confidence: number;
  reasons: string[];
  summary: string;
  measurements: { total: number; withinTolerance: number; outsideTolerance: number; criticalDeviations: number; };
}