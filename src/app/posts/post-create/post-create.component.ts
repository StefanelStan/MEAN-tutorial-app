import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
    selector: 'app-post-create', // for the ng tag from app.component.html
    templateUrl: './post-create.component.html', // where to html to go
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

    enteredTitle = '';
    enteredContent = '';
    private mode = 'create';
    private postId: string;
    isLoading = false;
    post: Post;
    form: FormGroup;
    imagePreview: string;
    private authSubscription: Subscription;

    constructor(public postsService: PostsService, public route: ActivatedRoute, public authService: AuthService) {
    }

    ngOnInit(): void {
        this.authSubscription =  this.authService.getAuthStatusListener().subscribe((status: boolean) => {
            this.isLoading = false;
        });
        this.form = new FormGroup({
            title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
            content: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
            image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                // this.post = this.postsService.getPost(this.postId);
                // start showing spinner here
                this.isLoading = true;
                this.postsService.getPostFromDB(this.postId).subscribe(postData => {
                    // hide spinner here as we have the data
                    this.isLoading = false;
                    console.log(postData);
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content,
                        imagePath: postData.imagePath,
                        creator: postData.creator
                    };
                    console.log(this.post);
                    // set the form value in case we have a loaded post, including the imagePath
                    this.form.setValue({ title: this.post.title, content: this.post.content, image: this.post.imagePath });
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onSavePost() {
        if (this.form.invalid) {
            return;
        }
        this.isLoading = true;
        if (this.mode === 'create') {
            this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
        } else {
            this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
        }
        this.form.reset();
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();
        console.log(file);
        console.log(this.form);
        const reader = new FileReader();
        reader.onload = () => { // callback async function. When readAsDataURL will finish reading, it will populate the this.ImagePreview
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);

    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }
}

