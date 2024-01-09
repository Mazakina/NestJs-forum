import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch question comments (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerCommentFactory,
        AnswerFactory,
      ],
    }).compile()

    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    studentFactory = moduleRef.get(StudentFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test.skip('[GET] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'Jhondoe@example.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    await Promise.all([
      answerCommentFactory.makeAnswerCommentStudent({
        authorId: user.id,
        answerId: answer.id,
        content: 'Comment 01',
      }),
      answerCommentFactory.makeAnswerCommentStudent({
        authorId: user.id,
        answerId: answer.id,
        content: 'Comment 02',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id.toString()}/comments`)
      .set('Authorization', `bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: 'Comment 02' }),
        expect.objectContaining({ content: 'Comment 01' }),
      ]),
    })
  })
})
