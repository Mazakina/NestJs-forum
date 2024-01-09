import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  } else {
    return left('error')
  }
}

test.skip('success result', () => {
  const successResult = doSomething(true)
  expect(successResult.isRight()).toBe(true)
})

test.skip('error result', () => {
  const successResult = doSomething(false)

  expect(successResult.isLeft()).toBe(true)
})
