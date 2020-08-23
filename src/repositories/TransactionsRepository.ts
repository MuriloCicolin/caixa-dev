import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(id: string): Promise<Balance> {
    const transactions = await this.find({
      where: {
        user_id: id,
      },
    });

    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((acc, atual) => {
        return acc + Number(atual.value);
      }, 0);

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((acc, atual) => {
        return acc + Number(atual.value);
      }, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public async getTransactions(id: string): Promise<Transaction[]> {
    const transactions = await this.find({
      where: {
        user_id: id,
      },
      select: ['id', 'description', 'type', 'value', 'user_id'],
      relations: ['category'],
    });

    return transactions;
  }
}

export default TransactionsRepository;
