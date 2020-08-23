import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import AuthMiddleware from '../middlewares/AuthMiddleware';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionsRouter = Router();

transactionsRouter.get('/', AuthMiddleware, async (request, response) => {
  const { id } = request.user;

  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.getTransactions(id);

  const { total } = await transactionsRepository.getBalance(id);

  return response.json({ total, transactions });
});

transactionsRouter.post('/', AuthMiddleware, async (request, response) => {
  const { description, type, value, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const transactions = await createTransactionService.execute({
    description,
    type,
    value,
    category,
    user_id: request.user.id,
  });

  return response.json(transactions);
});

export default transactionsRouter;
