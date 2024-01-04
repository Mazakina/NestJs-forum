import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async findByID(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    return answerComment ?? null
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === answerComment.id.toString(),
    )
    this.items.splice(index, 1)
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    const AnswerComments = this.items
      .filter((comment) => comment.answerId.toString() === answerId)
      .slice((params.page - 1) * 20, params.page * 20)

    return AnswerComments
  }
}
