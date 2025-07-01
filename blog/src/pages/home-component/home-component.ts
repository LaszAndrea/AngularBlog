import { Component } from '@angular/core';
import { BlogPost } from '../../models/BlogPost';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-component',
  imports: [FormsModule, DatePipe, CommonModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent {

  constructor(private router: Router, private blogService: BlogService, private toastr: ToastrService) { }

  userName = 'XY';
  currentUserId: String = localStorage.getItem('userId')!!
  posts: BlogPost[] = []

  blogpost = {
    title: '',
    content: '',
    author: '',
    userId: '',
    date: '',
    pictureUrl: ''
  }

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userName = user.name;
    }
    this.blogService.getAllPosts()
      .subscribe({
        next: (data) => {
          this.posts = data
        },
        error: (err: { error: { message: string; }; }) => {
        }
      })
  }

  addPost() {
    this.blogService.addPost({ title: this.blogpost.title, content: this.blogpost.content, author: this.userName, userId: localStorage.getItem('userId')!!, date: new Date(), pictureUrl: this.blogpost.pictureUrl })
      .subscribe({
        next: (newPost) => {
          this.posts.unshift(newPost);
          this.toastr.success('Új poszt létrehozva!', 'Siker');
        },
        error: (err: { error: { message: string; }; }) => {
          this.toastr.error(err.error.message, 'Hiba');
        }
      })

    this.blogpost = {
      title: '',
      content: '',
      author: '',
      userId: '',
      date: '',
      pictureUrl: ''
    };

  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  editingPostId: string | null = null;
  editedPost = {
    title: '',
    content: '',
    pictureUrl: ''
  };

  editPost(post: any) {
    this.editingPostId = post._id;
    this.editedPost = { title: post.title, content: post.content, pictureUrl: post.pictureUrl };
  }

  cancelEdit() {
    this.editingPostId = null;
  }

  saveEdit(post: BlogPost) {
    const updated = {
      ...post,
      title: this.editedPost.title,
      content: this.editedPost.content,
      picutreUrl: this.editedPost.pictureUrl
    };

    this.blogService.updatePost(updated).subscribe({
      next: (res) => {
        post.title = res.title;
        post.content = res.content;
        post.date = new Date;
        post.pictureUrl = res.pictureUrl;
        this.editingPostId = null;
        this.toastr.success('Sikeres módosítás!');
      },
      error: () => {
        this.toastr.error('Hiba történt a módosítás során.');
      }
    });
  }

  deletePost(currentPost: BlogPost) {
    if (confirm(`Biztosan törlöd a(z) ${currentPost.title} posztot?`)) {
      this.blogService.deletePost(currentPost._id).subscribe({
        next: () => {
          this.toastr.success('Sikeres törlés!');
          this.posts = this.posts.filter(t => t._id !== currentPost._id);
        },
        error: (err) => {
          this.toastr.error('Hiba történt a törlés során.');
        }
      });
    }
  }

}
