import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card from './Card'
import {  Teams } from '../consts'

test('renders content', () => {
  const card = {
    word: 'CROMULENT',
    category: Teams.NEUTRAL
  }

  render(
    <Card
    //   key={card.key}
      word={card.word}
      category={card.category}
    //   playerRole={playerRole}
    //   revealCard={revealCard}
    //   isRevealed={card.isRevealed}
    //   gameOver={isGameOver}
    //   id={index}
    />
  )

  const element = screen.getByText('CROMULENT')
  expect(element).toBeDefined()
})

test('renders content - check class', () => {
    const card = {
      word: 'CROMULENT',
      category: Teams.NEUTRAL,
    }

    const { container } = render(
      <Card
        key={card.key}
        word={card.word}
        category={card.category}
      //   playerRole={playerRole}
      //   revealCard={revealCard}
      //   isRevealed={card.isRevealed}
      //   gameOver={isGameOver}
      //   id={index}
      />
    )

    const div = container.querySelector('.card')
    expect(div).toHaveTextContent(
        'CROMULENT'
    )
})

test('clicking the button calls event handler once', async () => {
    const card = {
        word: 'CROMULENT',
        category: Teams.NEUTRAL
      }

      const mockHandler = jest.fn()

      render(
        <Card
        //   key={card.key}
          word={card.word}
          category={card.category}
        //   playerRole={playerRole}
          revealCard={mockHandler}
        //   isRevealed={card.isRevealed}
        //   gameOver={isGameOver}
        //   id={index}
        />
      )

    const user = userEvent.setup()
    const button = screen.getByText('CROMULENT')
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
  })

  // expect(div).toHaveStyle('display: none')
