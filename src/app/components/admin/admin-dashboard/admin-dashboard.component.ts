import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../services/admin-auth.service';
import { AdminContentService } from '../../../services/admin-content.service';
import { AdminRole, AdminUser } from '../../../interfaces/admin';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  sections = ['hero', 'ctas', 'skills', 'education', 'experience', 'certificates', 'projects', 'contact'];
  selectedSection = 'hero';
  jsonEditor = '';
  loading = false;
  message = '';
  messageType: 'ok' | 'error' = 'ok';
  currentUser = this.authService.getCurrentUser();
  users: AdminUser[] = [];

  newUser = {
    fullName: '',
    email: '',
    password: '',
    role: 'editor' as AdminRole,
  };

  constructor(
    private authService: AdminAuthService,
    private contentService: AdminContentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSection(this.selectedSection);
    if (this.currentUser?.role === 'super_admin') {
      this.loadUsers();
    }
  }

  loadSection(section: string): void {
    this.selectedSection = section;
    this.loading = true;
    this.message = '';
    this.contentService.getSection(section).subscribe({
      next: (res) => {
        this.jsonEditor = JSON.stringify(res, null, 2);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.setMessage('Failed to load section.', 'error');
      },
    });
  }

  saveSection(): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(this.jsonEditor);
    } catch {
      this.setMessage('JSON is invalid. Fix formatting first.', 'error');
      return;
    }

    this.loading = true;
    this.contentService.updateSection(this.selectedSection, parsed).subscribe({
      next: () => {
        this.loading = false;
        this.setMessage(`${this.selectedSection} updated successfully.`, 'ok');
      },
      error: () => {
        this.loading = false;
        this.setMessage('Update failed. Check role/permissions.', 'error');
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/admin/login');
  }

  loadUsers(): void {
    this.contentService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
      },
    });
  }

  createUser(): void {
    if (!this.newUser.fullName || !this.newUser.email || !this.newUser.password) {
      this.setMessage('Fill fullName, email, and password first.', 'error');
      return;
    }
    this.contentService.createUser(this.newUser).subscribe({
      next: () => {
        this.setMessage('Admin user created.', 'ok');
        this.newUser = { fullName: '', email: '', password: '', role: 'editor' };
        this.loadUsers();
      },
      error: () => {
        this.setMessage('Could not create user.', 'error');
      },
    });
  }

  private setMessage(text: string, type: 'ok' | 'error'): void {
    this.message = text;
    this.messageType = type;
  }
}
