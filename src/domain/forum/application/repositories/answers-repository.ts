import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export interface AnswersRepository {
  findByID(id: string): Promise<Answer | null>
  create(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
  findManyByAnswerId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>
}
