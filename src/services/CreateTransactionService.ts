import { getRepository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  description: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
  user_id: string;
}

class CreateTransactionService {
  public async execute({
    description,
    type,
    value,
    category,
    user_id,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);

    const transactionRepository = getCustomRepository(TransactionsRepository);

    let transactionCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const transactions = transactionRepository.create({
      description,
      type,
      value,
      category: transactionCategory,
      user_id,
    });

    await transactionRepository.save(transactions);

    return transactions;
  }
}

export default CreateTransactionService;
