import { createActionGroup, emptyProps, props} from '@ngrx/store';
import { Post } from '../interfaces/post.interface';

export const postActions = createActionGroup({
    source: 'post',
    events: {
        'posts loaded': emptyProps(),
        'posts loaded success': props<{posts: Post[]}>(),
        'posts loaded failure': props<{error: any}>()
    }
})