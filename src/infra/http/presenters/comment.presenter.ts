import { Comment } from '@/domain/forum/enterprise/entities/comment'

export class CommentPresenter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toHttp(comment: Comment<any>) {
    return {
      id: comment.id.toString(),
      authorId: comment.authorId.toString(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      content: comment.content,
    }
  }
}
