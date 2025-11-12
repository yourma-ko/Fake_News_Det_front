import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span class="logo">FakeCheck</span>
      <span class="spacer"></span>
      <span class="user-email" *ngIf="currentUser$ | async as user">
        {{ user.email }}
      </span>
      <button mat-icon-button (click)="logout()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="/app/verify" routerLinkActive="active">
            <mat-icon matListItemIcon>fact_check</mat-icon>
            <span matListItemTitle>Проверка</span>
          </a>
          <a mat-list-item routerLink="/app/history" routerLinkActive="active">
            <mat-icon matListItemIcon>history</mat-icon>
            <span matListItemTitle>История</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-email {
      margin-right: 16px;
    }

    .sidenav-container {
      height: calc(100vh - 64px);
    }

    .sidenav {
      width: 200px;
    }

    .content {
      padding: 20px;
    }

    .active {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class DashboardLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
  }
}
