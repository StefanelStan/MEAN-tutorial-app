import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(private http: HttpClient, private router: Router) {
    }

    getPosts(postsPerPage: number, currentPage: number) {
        // return [...this.posts];
        const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
        return this.http.get<{message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
          // posts: any type because it's no longer of Posts[] due to _id instead if id
            .pipe(map((postData) => {
                console.log(postData.maxPosts);
                return {
                    posts: postData.posts.map(post => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath
                        };
                    }),
                    maxPosts: postData.maxPosts // we also return the max posts in case they get updated by user.
                };
            }))
            .subscribe((transformedPosts) => {
                console.log(transformedPosts);
                this.posts = transformedPosts.posts;
                this.postsUpdated.next({posts: [...this.posts], postCount: transformedPosts.maxPosts}); // also emit the new post count
            });
    }

    getPostFromDB(id: string) {
        // return {...this.posts.find(post => post.id === id )};
        // we want to return a real post from DB but this is async so we will return an
        // observable and we will subscribe from the post-create component
        return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
    }

    getPost(id: string) {
        return {...this.posts.find(post => post.id === id )};
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string, image: File) {
        // const post: Post = {id: null, title, content};
        // we can't send JSON but we need to send form data (including picture)
        const postData = new FormData(); // form data that allows to combine BLOB and json/text data
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title); // 3rd argument is the fileName. As we reconstruct it on backend, it's not important

        this.http
            // .post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
            .post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
            // angular will detect postData and set headers and body automatically
            .subscribe((responseData) => {
/* Not needed as page nagivation will run ngOnInit and fetch posts by itself
                console.log(responseData.message + '-' + responseData.post);
                const returnedPost: Post = {id: responseData.post.id, title, content, imagePath: responseData.post.imagePath};
                this.posts.push(returnedPost);
                this.postsUpdated.next([...this.posts]); */
            });
        this.router.navigate(['/']);
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        // we will build the Post based on image type; image/string object
        // const post: Post = {id, title, content, imagePath: null};
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id); // remember to put id as user updates new file and this id is rad on backend
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else { // I have a string andf send a json object
            postData = { id, title, content, imagePath: image };
        }
        this.http
            .put('http://localhost:3000/api/posts/' + id, postData)
            .subscribe((responseData: Post) => {
                // console.log(responseData.message); don't just log the response but update in the local copy of posts
/* Not needed as page nagivation will run ngOnInit and fetch posts by itself
                const updatesPosts = [...this.posts];
                const oldPostIndex = updatesPosts.findIndex(p => p.id === id);
                const post: Post = {id, title, content, imagePath: responseData.imagePath };
                updatesPosts[oldPostIndex] = post;
                this.posts = updatesPosts;
                this.postsUpdated.next([...this.posts]); */
            });
        this.router.navigate(['/']);
    }

    deletePost(postId: string) {
        return this.http.delete('http://localhost:3000/api/posts/' + postId);
            // .subscribe(() => {
            //     console.log('Deleted!');
            //     const updatedPosts = this.posts.filter(post => post.id !== postId );
            //     this.posts = updatedPosts;
            //     this.postsUpdated.next([...this.posts]);
    }
}
