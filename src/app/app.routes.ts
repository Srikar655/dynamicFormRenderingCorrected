import { Routes } from '@angular/router';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { InspectionResultsComponent } from './inspection-results/inspection-results.component';
import { SubmissionListComponent } from './submission-list/submission-list.component';
import { FormsListComponent } from './forms-list/forms-list.component';

export const routes: Routes = [
    { path: '', component: FormsListComponent },
    { path: 'dynamicForm/:id', component: DynamicFormComponent },
    { path: 'results', component: InspectionResultsComponent },
    { path: 'submissions', component: SubmissionListComponent },
    { path: '**', redirectTo: '' }
];
