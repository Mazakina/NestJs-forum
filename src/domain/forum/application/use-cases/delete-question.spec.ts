import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let answerinMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    answerinMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      answerinMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
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
