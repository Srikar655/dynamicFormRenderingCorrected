import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspectionService } from '../services/inspection.service';
import { InspectionStatus } from '../models/backend-models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submission-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submission-list.component.html',
  styleUrl: './submission-list.component.scss'
})
export class SubmissionListComponent implements OnInit {
  service!: InspectionService;
  reports: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  router=inject(Router);

  constructor(private inspectionService: InspectionService) {
    this.service = inspectionService;
  }

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    this.error = null;
    
    this.service.getReportsData().subscribe({
      next: (res: any) => {
        this.reports = res;
        console.log(res);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading reports:', err);
        this.error = 'Failed to load reports. Please try again.';
        this.loading = false;
      }
    });
  }

  refreshList() {
    this.loadReports();
  }

  getStatusClass(status: InspectionStatus): string {
    return `status-${status.toLowerCase()}`;
  }

  getDecisionClass(decision: string): string {
    return `decision-${decision.toLowerCase()}`;
  }

  editSubmission(report: any) {
    // TODO: Implement edit functionality
    console.log('Edit submission:', report);
    this.router.navigate(['/dynamicForm/'+report.formDefinitionId],{ state: { report } })
    
  }

  deleteSubmission(report: any) {
    // TODO: Implement delete functionality
    console.log('Delete submission:', report.id);
    this.service.delete(report.id).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.reports.splice(this.reports.indexOf(report),1);
      },
      error:(err:any)=>{
        console.log(err);
      }
    })
  }
}
