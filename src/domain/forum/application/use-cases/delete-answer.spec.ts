import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { DeleteAnswerUseCase } from './delete-answer'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })
  // sut =system under test
  it('should be able to delete a answer', async () => {
    const answer = makeAnswer()
    inMemoryAnswersRepository.create(answer)
    inMemoryAnswersRepository.create(makeAnswer())

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
    )

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
    })
    expect(inMemoryAnswersRepository.items.length).toEqual(1)
    expect(inMemoryAnswerAttachmentsRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const answer = makeAnswer()
    inMemoryAnswersRepository.create(answer)
    inMemoryAnswersRepository.create(makeAnswer())

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
