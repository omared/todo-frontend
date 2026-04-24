import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  showModal = false;
  isEditing = false;

  currentUser: Omit<User, '_id' | 'createdAt'> = {
    name: '', email: '', phone: ''
  };
  editingId: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error cargando usuarios:', err);
        this.isLoading = false;
      }
    });
  }

  openModal(user?: User): void {
    if (user) {
      this.isEditing = true;
      this.editingId = user._id!;
      this.currentUser = { name: user.name, email: user.email, phone: user.phone };
    } else {
      this.isEditing = false;
      this.editingId = null;
      this.currentUser = { name: '', email: '', phone: '' };
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveUser(): void {
    if (!this.currentUser.name || !this.currentUser.email || !this.currentUser.phone) return;

    if (this.isEditing && this.editingId) {
      this.userService.updateUser(this.editingId, this.currentUser).subscribe({
        next: (updated: User) => {
          const index = this.users.findIndex(u => u._id === updated._id);
          if (index !== -1) this.users[index] = updated;
          this.closeModal();
        },
        error: (err: any) => console.error('Error actualizando:', err)
      });
    } else {
      this.userService.createUser(this.currentUser).subscribe({
        next: (user: User) => {
          this.users.unshift(user);
          this.closeModal();
        },
        error: (err: any) => console.error('Error creando:', err)
      });
    }
  }

  deleteUser(id: string): void {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u._id !== id);
      },
      error: (err: any) => console.error('Error eliminando:', err)
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}
