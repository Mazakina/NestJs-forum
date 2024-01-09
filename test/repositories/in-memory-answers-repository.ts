import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findManyByAnswerId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((answer) => answer.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20)

    return answers
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)

    return answer ?? null
  }

  async delete(answer: Answer): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )
    this.items.splice(index, 1)

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async create(answer: Answer) {
    this.items.push(answer)
    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )
    this.items[index] = answer

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    )

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
