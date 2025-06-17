import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { InspectionResultsComponent } from './inspection-results/inspection-results.component';
import { InspectionService } from './services/inspection.service';
import { InspectionResult } from './models/form.models';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'BHEL Dynamic Forms';
  inspectionResult: InspectionResult | null = null;
  showResults = false;

  constructor(private inspectionService: InspectionService) {}

  ngOnInit() {
    
  }


}

