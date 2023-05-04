import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProgramService } from '../../workout/program.service';
import { UserProgramService } from '../../workout/user-program.service';
import { ActivatedRoute } from '@angular/router';
import { Program, User } from '../../types/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;
  program: Program | undefined;
  user: User | null;
  followingProgram: boolean = false;
  addingProgramToUser: boolean = false;


  constructor(
    private route: ActivatedRoute, 
    private programService: ProgramService, 
    private authService: AuthService,
    private userProgramService: UserProgramService) {
    this.user = this.authService.loggedInUser;
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.programService.getProgram(params['id']).then(program => {
        this.program = program;

        if (this.user) {
          this.userProgramService.getUserPrograms(this.user.id).subscribe(userPrograms => {
            this.followingProgram = userPrograms
              .map(userProgram => userProgram.id)
              .includes(this.program?.id!);
          });
        }
      });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  addProgramToUser() {
    this.addingProgramToUser = true;
    this.userProgramService.addProgramToUser(this.user!.id, this.program!.id!, this.program!.title)
      .finally(() => {
        this.addingProgramToUser = false;
      })
  }
}
