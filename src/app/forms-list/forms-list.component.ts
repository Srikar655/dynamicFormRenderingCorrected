import { Component, inject, OnInit } from '@angular/core';
import { DynamicformsstoringService } from '../services/dynamicformsstoring.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forms-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forms-list.component.html',
  styleUrl: './forms-list.component.scss'
})
export class FormsListComponent implements OnInit {
  forms: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  router = inject(Router);
  service = inject(DynamicformsstoringService);

  ngOnInit(): void {
    this.loadForms();
  }

  loadForms() {
    this.loading = true;
    this.error = null;
    
    this.service.getFormsList().subscribe({
      next: (res: any) => {
        this.forms = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading forms:', err);
        this.error = 'Failed to load forms. Please try again.';
        this.loading = false;
      }
    });
  }

  refreshList() {
    this.loadForms();
  }

  onSelect(form: any) {
    this.router.navigate(['/dynamicForm/'+form.id]);
  }
}
