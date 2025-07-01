import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/BlogPost';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/api';

  addPost(blogPost: { title: String, content: String, author: String, userId: String, date: Date, pictureUrl: String}): Observable<any> {
      return this.http.post(`${this.apiUrl}/addPost`, blogPost);
  }

  getAllPosts(){
    return this.http.get<BlogPost[]>(`${this.apiUrl}/getAllPosts`);
  }

  deletePost(id: string){
    return this.http.delete(`${this.apiUrl}/deletePost/${id}`);
  } 

  updatePost(post: BlogPost): Observable<any>{
    return this.http.put<BlogPost>(`${this.apiUrl}/posts/${post._id}`, post);
  } 

}
