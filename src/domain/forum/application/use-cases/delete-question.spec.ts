import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let answerinMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    answerinMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      answerinMemoryQuestionAttachmentsRepository,
    )
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })
  // sut =system under test
  it('should be able to delete a question', async () => {
    const question = makeQuestion()
    inMemoryQuestionsRepository.create(question)
    inMemoryQuestionsRepository.create(makeQuestion())

    answerinMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityID('2'),
      }),
      makeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityID('1'),
      }),
    )

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
    })
    expect(inMemoryQuestionsRepository.items.length).toEqual(1)
    expect(answerinMemoryQuestionAttachmentsRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const question = makeQuestion()
    inMemoryQuestionsRepository.create(question)
    inMemoryQuestionsRepository.create(makeQuestion())

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
