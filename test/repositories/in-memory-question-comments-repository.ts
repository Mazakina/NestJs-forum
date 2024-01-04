import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async findByID(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    return questionComment ?? null
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === questionComment.id.toString(),
    )
    this.items.splice(index, 1)
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> {
    const QuestionComments = this.items
      .filter((comment) => comment.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20)

    return QuestionComments
  }
}
