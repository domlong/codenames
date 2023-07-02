import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Clue from './Clue'
import userEvent from '@testing-library/user-event'

test('<Clue /> updates parent state and calls onSubmit', async () => {
  const sendClue = jest.fn()
  const user = userEvent.setup()

  render(
    <Clue
    clue={{ text: '', guesses: 0 }}
    sendClue={sendClue}
    itIsYourTurn
    isVisible={true}
    waitingForClue={true}
    // gameOver={isGameOver}
  />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('1')
// const sendButton = screen.getByRole('button')

  await user.type(input, 'test clue')
  await user.click(sendButton)

  expect(sendClue.mock.calls).toHaveLength(1)
  expect(sendClue.mock.calls[0][0]).toEqual({ text: 'test clue', guesses: 1 })
})