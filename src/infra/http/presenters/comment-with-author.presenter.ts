import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toHttp(commentWithAuthor: CommentWithAuthor) {
    return {
      commentId: commentWithAuthor.commentId.toString(),
      authorId: commentWithAuthor.authorId.toString(),
      author: commentWithAuthor.author,
      content: commentWithAuthor.content,
      updatedAt: commentWithAuthor.updatedAt,
      createdAt: commentWithAuthor.createdAt,
    }
  }
}
