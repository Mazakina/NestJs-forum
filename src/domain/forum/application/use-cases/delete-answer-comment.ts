import { Either, left, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  NonNullable<unknown>
>

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answerComment.authorId.toString()) {
      return left(new NotAllowedError())
    }
    await this.answerCommentsRepository.delete(answerComment)

    return right({})
  }
}
