import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';

@Component({
    selector: 'app-post-list', // for the ng tag from app.component.html
    templateUrl: './post-list.component.html', // where to html to go
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    // posts = [
    //     { title: 'First Post', content: 'First post\'s content' },
    //     { title: 'Second Post', content: 'Second post\'s content' },
    //     { title: 'Third Post', content: 'Third post\'s content' }
    // ];
    posts: Post[] = [];
    private postsSub: Subscription;
    isLoading = false;
    totalPosts = 10;
    postsPerPage = 2;
    pageSizeOptions = [1, 2, 5, 10];
    currentPage = 1;
    // postsService: PostsService;

    // constructor(postsService: PostsService) {
    //     this.postsService = postsService;
    // }
    constructor(public postsService: PostsService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postsSub = this.postsService.getPostUpdateListener()
            .subscribe((postData: {posts: Post[], postCount: number}) => {
                this.isLoading = false;
                this.totalPosts = postData.postCount;
                console.log(this.totalPosts);
                this.posts = postData.posts;
            });
    }

    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
    }

    onDelete(postId: string) {
        this.isLoading =  true;
        this.postsService.deletePost(postId).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        console.log(pageData);
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        // on ngOnInit this component listens to the observable. So this getPosts
        // inside postService triggers the listener to reach thus notifiying this component and updating the posts
    }

}
