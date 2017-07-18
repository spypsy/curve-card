import express from 'express'

import { coWrapper, getAmount } from '../helpers'
import Card from '../models/cardModel'
import Trx from '../models/transactionModel'

const router = express.Router()

function* requestAuth(req, res) {
  const { cardId, amount } = req.body
  const numAmount = getAmount(amount, res)
  const card = yield Card.findOne({
    _id: cardId,
  }).lean()
  if (!card) {
    return res.status(400).send('Invalid card ID')
  }

  const availableBalance = card.balance - card.blockedBalance
  const authorized = numAmount <= availableBalance

  const trx = yield Trx.create({
    card: card._id,
    amount: numAmount,
    authorized,
  })

  yield Card.update(
    { _id: cardId },
    {
      $push: { transactions: trx._id },
      ...(authorized && {
        $set: {
          blockedBalance: (card.blockedBalance || 0) + numAmount,
        },
      }),
    },
  )

  return res.json({ transaction: trx })
}

function* captureAmount(req, res) {
  const { transactionId, amount } = req.body
  const numAmount = getAmount(amount, res)
  const trx = yield Trx.findOne({
    _id: transactionId,
  }).lean()

  if (!trx) {
    return res.status(400).send('Invalid transaction ID')
  }

  if (!trx.authorized) {
    return res.status(400).send('Transaction was not authorized')
  }

  if (trx.completed) {
    return res.status(400).send('Transaction has been completed')
  }

  const remainingAmount = trx.amount - trx.capturedAmount - trx.reversedAmount
  if (numAmount > remainingAmount) {
    return res.status(400).send('Invalid amount requested: too large')
  }

  const newCapturedAmount = trx.capturedAmount + numAmount
  const isTrxComplete = numAmount === remainingAmount

  yield Trx.update(
    {
      _id: trx._id,
    },
    {
      $set: {
        capturedAmount: newCapturedAmount,
        ...(isTrxComplete && { completed: true }),
      },
    },
  )

  // update card
  yield Card.update(
    {
      _id: trx.card,
    },
    {
      $inc: {
        blockedBalance: -numAmount,
        balance: -numAmount,
      },
    },
  )

  // also update local js object to return to api
  const newTransaction = {
    ...trx,
    capturedAmount: newCapturedAmount,
    completed: isTrxComplete,
  }
  return res.json({ newTransaction })
}

function* reverseAmount(req, res) {
  const { transactionId, amount } = req.body
  const numAmount = getAmount(amount, res)
  const trx = yield Trx.findOne({
    _id: transactionId,
  }).lean()

  if (!trx) {
    return res.status(400).send('Invalid transaction ID')
  }

  if (!trx.authorized) {
    return res.status(400).send('Transaction was not authorized')
  }

  if (trx.completed) {
    return res.status(400).send('Transaction has been completed')
  }

  const remainingAmount = trx.amount - trx.capturedAmount - trx.reversedAmount
  if (numAmount > remainingAmount) {
    return res.status(400).send('Invalid amount requested: too large')
  }

  const newReversedAmount = trx.reversedAmount + numAmount
  const isTrxComplete = numAmount === remainingAmount
  yield Trx.update(
    {
      _id: trx._id,
    },
    {
      $set: { reversedAmount: newReversedAmount },
      ...(isTrxComplete && { completed: true }),
    },
  )

  // update card
  yield Card.update(
    {
      _id: trx.card,
    },
    {
      $inc: {
        blockedBalance: -numAmount,
      },
    },
  )

  // also update local js object to return to api
  const newTransaction = {
    ...trx,
    reversedAmount: newReversedAmount,
    completed: isTrxComplete,
  }
  return res.json({ newTransaction })
}

function* refund(req, res) {
  const {transactionId} = req.body;
  const trx = Trx.findOne({
    _id: transactionId
  }).lean()

  if (!trx) {
    return res.status(400).send('Invalid transaction ID')
  }

  if (!trx.completed || !trx.authorized) {
    return res.status(400).send('Transaction is not complete')
  }

  yield Trx.update({
    _id: trx._id
  }, {
    $set: {refunded: true},
  })

  yield Card.update({
    _id: trx.card
  }, {
    $inc: {balance: trx.amount - trx.reversedAmount}
  })

  return res.status(200);
}

router.post('/request-auth', coWrapper(requestAuth))
router.post('/capture', coWrapper(captureAmount))
router.post('/reverse', coWrapper(reverseAmount))
router.post('/refund', coWrapper(refund))

export default router
