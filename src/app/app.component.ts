import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GistService } from './services/gist.service';
import { Movie } from './models/movie.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  movies: Movie[] = [];
  loading = false;
  saving = false;
  toast: { message: string; type: 'success' | 'error' } | null = null;
  rawUrl = '';
  urlCopied = false;
  m3uCopied = false;
  deleteConfirm: string | null = null;

  newMovie: Movie = { title: '', logo: '', streamUrl: '' };
  showForm = false;
  previewMovie: Movie | null = null;

  constructor(private gistService: GistService) {}

  ngOnInit(): void {
    this.rawUrl = this.gistService.getRawUrl();
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.gistService.fetchMovies().subscribe({
      next: movies => {
        this.movies = movies;
        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load movies. Check your token & Gist ID.', 'error');
        this.loading = false;
      }
    });
  }

  addMovie(): void {
    if (!this.newMovie.title || !this.newMovie.streamUrl) {
      this.showToast('Title and Stream URL are required.', 'error');
      return;
    }
    const exists = this.movies.find(m => m.title.toLowerCase() === this.newMovie.title.toLowerCase());
    if (exists) {
      this.showToast('A movie with this title already exists.', 'error');
      return;
    }
    this.saving = true;
    const updated = [...this.movies, { ...this.newMovie }];
    this.gistService.updateGist(updated).subscribe({
      next: () => {
        this.movies = updated;
        this.newMovie = { title: '', logo: '', streamUrl: '' };
        this.showForm = false;
        this.saving = false;
        this.showToast('Movie added successfully!', 'success');
      },
      error: () => {
        this.saving = false;
        this.showToast('Failed to save. Check your token permissions.', 'error');
      }
    });
  }

  confirmDelete(title: string): void {
    this.deleteConfirm = title;
  }

  deleteMovie(title: string): void {
    this.saving = true;
    const updated = this.movies.filter(m => m.title !== title);
    this.gistService.updateGist(updated).subscribe({
      next: () => {
        this.movies = updated;
        this.saving = false;
        this.deleteConfirm = null;
        this.showToast('Movie deleted.', 'success');
      },
      error: () => {
        this.saving = false;
        this.showToast('Failed to delete.', 'error');
      }
    });
  }

  copyRawUrl(): void {
    navigator.clipboard.writeText(this.rawUrl).then(() => {
      this.urlCopied = true;
      setTimeout(() => this.urlCopied = false, 2000);
    });
  }

  copyM3U(): void {
    const content = this.gistService.buildM3U(this.movies);
    navigator.clipboard.writeText(content).then(() => {
      this.m3uCopied = true;
      setTimeout(() => this.m3uCopied = false, 2000);
    });
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3500);
  }

  openPreview(movie: Movie): void {
    this.previewMovie = movie;
  }

  closePreview(): void {
    this.previewMovie = null;
  }

  cancelDelete(): void {
    this.deleteConfirm = null;
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/no-poster.svg';
  }
}
