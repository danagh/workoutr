import { Component, OnInit } from '@angular/core';
import { ProgramService } from '../../workout/program.service';
import { Program, User, UserResults } from '../../types/common';
import { AuthService } from '../../auth/auth.service';
import { UserResultsService } from '../../workout/user-results.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User | null;
  allPrograms: Program[] | null = null;
  filteredPrograms: Program[] | null = null;
  results: UserResults | undefined | null = null;

  constructor(private programService: ProgramService, private authService: AuthService, private userResultsService: UserResultsService) {
    this.user = this.authService.loggedInUser;

    this.programService.programsFilterOutput.subscribe(result => {
      this.filteredPrograms = result;
    });

    this.programService.programsOutput.subscribe(result => {
      if (!this.allPrograms) {
        this.allPrograms = result;
      } else {
        this.allPrograms = [...this.allPrograms, ...result];
      }
    });
  }

  ngOnInit() {
    this.loadMorePrograms();
    if (this.user) {
      this.programService.searchPrograms([{ attribute: 'type', operator: 'in', value: this.user.interests || [] }]);
      this.userResultsService.getUserResults(this.user!.id)
        .then(results => {
          this.results = results;
        });
    }
  }

  loadMorePrograms() {
    this.programService.getPrograms();
  }
}
