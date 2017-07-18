import express from 'express'

import { coWrapper, getAmount } from '../helpers'
import Card from '../models/cardModel'

const router = express.Router()

function* fetchCard(req, res) {
  const { cardId } = req.params
  const card = yield Card.findOne({
    _id: cardId,
  }).lean()

  if (!card) {
    return res.status(404).send('Invalid card id')
  }

  return res.json({ card })
}

function* fetchCards(req, res) {
  const cards = yield Card.find().lean()
  return res.json({ cards })
}

function* createCard(req, res) {
  const { name, description, amount } = req.body

  const numAmount = getAmount(amount, res);

  const card = yield Card.create({
    name,
    description,
    balance: numAmount,
  })

  return res.json({ newCard: card })
}

function* topUpCard(req, res) {
  const { amount, cardId } = req.body

  const numAmount = getAmount(amount, res);

  const card = yield Card.findOne({ _id: cardId }).lean()

  if (!card) {
    return res.status(404).send('Invalid card id')
  }

  const newBalance = card.balance + numAmount

  yield Card.update({ _id: cardId }, { $set: { balance: newBalance } })

  return res.json({ newBalance })
}

router.post('/', coWrapper(createCard))
router.get('/', coWrapper(fetchCards))
router.post('/top-up', coWrapper(topUpCard))
router.get('/:cardId', coWrapper(fetchCard))

export default router
