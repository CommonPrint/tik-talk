import { createFeature, createReducer, on } from "@ngrx/store"
import { Post } from "../interfaces/post.interface"
import { postActions } from "./actions"

export interface PostState {
    posts: Post[];
    error: any;
}
  
export const initialState: PostState = {
    posts: [],
    error: null,
};

export const postFeature = createFeature({
    name: 'postFeature',
    reducer: createReducer(
        initialState,
        on(postActions.postsLoadedSuccess, (state, {posts}) => {
            return {
                ...state,
                posts,
                error: null
            }
        }),
        on(postActions.postsLoadedFailure, (state, {error}) => {
            return {
                ...state,
                error,
            }
        })
    ),
})