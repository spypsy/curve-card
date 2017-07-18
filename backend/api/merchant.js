import express from 'express'

import { coWrapper } from '../helpers'
import Trx from '../models/transactionModel'

const router = express.Router()

function* getTransactions(req, res) {
  const {cardId} = req.params;
  const transactions = yield Trx.find({
    card: cardId,
  });

  return res.json({transactions})
}

router.get('/transactions/:cardId', coWrapper(getTransactions))

export default router
