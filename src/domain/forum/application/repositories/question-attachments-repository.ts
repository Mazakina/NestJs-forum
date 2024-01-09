import { Attachment } from '../../enterprise/entities/attachment'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export abstract class QuestionAttachmentsRepository {
  abstract createMany(attachments: Attachment[]): Promise<void>

  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>

  abstract deleteManyByQuestionId(questionId: string): Promise<void>
}
