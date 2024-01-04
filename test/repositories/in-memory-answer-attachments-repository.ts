import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )

    this.items = answerAttachments
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const AnswerAttachments = this.items.filter(
      (comment) => comment.answerId.toString() === answerId,
    )

    return AnswerAttachments
  }
}
