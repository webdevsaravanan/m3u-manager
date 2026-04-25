import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Movie } from '../models/movie.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GistService {
  private apiUrl = `https://api.github.com/gists/${environment.gistId}`;

  constructor(private http: HttpClient) {}

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `token ${environment.githubToken}`,
      Accept: 'application/vnd.github.v3+json',
    });
  }

  // Parse M3U text into Movie array
  parseM3U(content: string): Movie[] {
    const movies: Movie[] = [];
    const lines = content.split('\n').map(l => l.trim()).filter(l => l);
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('#EXTINF')) {
        const titleMatch = lines[i].match(/tvg-name="([^"]+)"/);
        const logoMatch = lines[i].match(/tvg-logo="([^"]+)"/);
        const title = titleMatch ? titleMatch[1] : lines[i].split(',').pop() || '';
        const logo = logoMatch ? logoMatch[1] : '';
        const streamUrl = lines[i + 1] && !lines[i + 1].startsWith('#') ? lines[i + 1] : '';
        if (title && streamUrl) {
          movies.push({ title, logo, streamUrl });
          i++;
        }
      }
    }
    return movies;
  }

  // Convert Movie array to M3U text
  buildM3U(movies: Movie[]): string {
    let content = '#EXTM3U\n\n';
    for (const m of movies) {
      content += `#EXTINF:-1 tvg-name="${m.title}" tvg-logo="${m.logo}" group-title="Movies",${m.title}\n`;
      content += `${m.streamUrl}\n\n`;
    }
    return content.trim();
  }

  fetchMovies(): Observable<Movie[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.headers }).pipe(
      map(gist => {
        const file = gist.files['movies.m3u'];
        return file ? this.parseM3U(file.content) : [];
      })
    );
  }

  updateGist(movies: Movie[]): Observable<any> {
    const body = {
      files: {
        'movies.m3u': { content: this.buildM3U(movies) }
      }
    };
    return this.http.patch(this.apiUrl, body, { headers: this.headers });
  }

  getRawUrl(): string {
    return `https://gist.githubusercontent.com/${environment.githubUsername}/${environment.gistId}/raw/2b477341378bf28c5baa0eec2ad82848189d60c9/movies.m3u`;
  }
}
