import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository '

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Recent Answers', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch recent answer`s comments ', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        createdAt: new Date(2022, 0, 20),
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        createdAt: new Date(2022, 0, 18),
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        createdAt: new Date(2022, 0, 23),
        answerId: new UniqueEntityID('answer-2'),
      }),
    )

    const result = await sut.execute({
      page: 1,
      answerId: 'answer-1',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
  })
  it('should be able to fetch paginated recent answer ', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          createdAt: new Date(2022, 0, 20),
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      answerId: 'answer-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
  })
})
