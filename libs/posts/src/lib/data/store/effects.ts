import { inject, Injectable } from "@angular/core";
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { PostService } from "../services/post.service";
import { postActions } from "./actions";
import { catchError, map, of, switchMap } from "rxjs";


@Injectable({
    providedIn: 'root' 
})
export class PostEffects {

    postService = inject(PostService);
    actions$ = inject(Actions);

    posts = createEffect(() => 
        this.actions$.pipe(
            ofType(postActions.postsLoaded),
            switchMap(() => 
                this.postService.fetchPosts().pipe(
                    map(posts => {
                        return postActions.postsLoadedSuccess({posts})
                    }),
                    catchError((error) => of(postActions.postsLoadedFailure({error})))
                )
            )
        )
    )

}