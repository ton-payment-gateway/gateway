import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/_entities/transaction.entity';
import { IAnalyticsPeriod } from 'src/_utils/dto/analytics-period.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ETransactionStatus } from './types';
import { transactionFormatter } from 'src/_utils/formatter';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async findOne(options: FindOneOptions<Transaction>) {
    const res = await this.transactionRepo.findOne(options);
    return res;
  }

  async findMany(options: FindManyOptions<Transaction>) {
    const res = await this.transactionRepo.find(options);
    return res;
  }

  async save(data: Transaction) {
    const res = await this.transactionRepo.save(data);
    return res;
  }

  create(data: Partial<Transaction>) {
    const res = this.transactionRepo.create({
      ...data,
    });

    return res;
  }

  async getBalance(merchantId: string) {
    const res: { balance: string } = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select(
        'SUM(transaction.amount) - SUM(transaction.service_fee)',
        'balance',
      )
      .where('transaction.merchant_id = :merchantId', { merchantId })
      .getRawOne();

    return Number(res.balance);
  }

  async getGrossMarketValue(
    merchantId: string | null,
    period: IAnalyticsPeriod,
  ) {
    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'gmv')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      query.andWhere('transaction.merchant_id = :merchantId', { merchantId });
    }

    const res: { gmv: string } = await query.getRawOne();

    return Number(res.gmv);
  }

  async getGrossMarketValueChartData(
    merchantId: string | null,
    period: IAnalyticsPeriod,
  ) {
    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .select("DATE_TRUNC('day', transaction.created_at)", 'date')
      .addSelect('SUM(transaction.amount)', 'gmv')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      query.andWhere('transaction.merchant_id = :merchantId', { merchantId });
    }

    const res: { date: string; gmv: string }[] = await query
      .groupBy("DATE_TRUNC('day', transaction.created_at)")
      .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
      .getRawMany();

    return res.map((item) => ({
      date: item.date,
      gmv: Number(item.gmv),
    }));
  }

  async getServiceFee(merchantId: string | null, period: IAnalyticsPeriod) {
    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .select('SUM(transaction.service_fee)', 'service_fee')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      query.andWhere('transaction.merchant_id = :merchantId', { merchantId });
    }
    const res: { service_fee: string } = await query.getRawOne();

    return Number(res.service_fee);
  }

  async getServiceFeeChartData(
    merchantId: string | null,
    period: IAnalyticsPeriod,
  ) {
    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .select("DATE_TRUNC('day', transaction.created_at)", 'date')
      .addSelect('SUM(transaction.service_fee)', 'service_fee')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      query.andWhere('transaction.merchant_id = :merchantId', { merchantId });
    }

    const res: { date: string; service_fee: string }[] = await query
      .groupBy("DATE_TRUNC('day', transaction.created_at)")
      .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
      .getRawMany();

    return res.map((item) => ({
      date: item.date,
      serviceFee: Number(item.service_fee),
    }));
  }

  async getConversionRate(merchantId: string | null, period: IAnalyticsPeriod) {
    const totalTransactionsQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      });

    if (merchantId) {
      totalTransactionsQuery.andWhere('transaction.merchant_id = :merchantId', {
        merchantId,
      });
    }

    const totalTransactions: { count: string } =
      await totalTransactionsQuery.getRawOne();

    const completedTransactionsQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      completedTransactionsQuery.andWhere(
        'transaction.merchant_id = :merchantId',
        {
          merchantId,
        },
      );
    }

    const completedTransactions: { count: string } =
      await completedTransactionsQuery.getRawOne();

    if (Number(totalTransactions.count) === 0) {
      return 0;
    }

    return (
      (Number(completedTransactions.count) / Number(totalTransactions.count)) *
      100
    );
  }

  async getConversionRateChartData(
    merchantId: string | null,
    period: IAnalyticsPeriod,
  ) {
    const totalTransactionsQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .select("DATE_TRUNC('day', transaction.created_at)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      });

    if (merchantId) {
      totalTransactionsQuery.andWhere('transaction.merchant_id = :merchantId', {
        merchantId,
      });
    }

    const totalTransactions: { date: string; count: string }[] =
      await totalTransactionsQuery
        .groupBy("DATE_TRUNC('day', transaction.created_at)")
        .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
        .getRawMany();

    const completedTransactionsQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .select("DATE_TRUNC('day', transaction.created_at)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      completedTransactionsQuery.andWhere(
        'transaction.merchant_id = :merchantId',
        { merchantId },
      );
    }

    const completedTransactions: { date: string; count: string }[] =
      await completedTransactionsQuery
        .groupBy("DATE_TRUNC('day', transaction.created_at)")
        .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
        .getRawMany();

    const completedMap = new Map(
      completedTransactions.map((item) => [item.date, Number(item.count)]),
    );

    return totalTransactions.map((item) => {
      const completedCount = completedMap.get(item.date) || 0;
      const totalCount = Number(item.count);
      const conversionRate =
        totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

      return {
        date: item.date,
        conversionRate,
      };
    });
  }

  async getAverageConfirmationTime(
    merchantId: string | null,
    period: IAnalyticsPeriod,
  ) {
    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .select('AVG(transaction.confirmation_time)', 'avg_confirmation_time')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      query.andWhere('transaction.merchant_id = :merchantId', { merchantId });
    }

    const res: { avg_confirmation_time: string } = await query.getRawOne();

    return Number(res.avg_confirmation_time);
  }

  async getAverageConfirmationTimeChartData(
    merchantId: string | null,
    period: IAnalyticsPeriod,
  ) {
    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .select("DATE_TRUNC('day', transaction.created_at)", 'date')
      .addSelect('AVG(transaction.confirmation_time)', 'avg_confirmation_time')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      query.andWhere('transaction.merchant_id = :merchantId', { merchantId });
    }

    const res: { date: string; avg_confirmation_time: string }[] = await query
      .groupBy("DATE_TRUNC('day', transaction.created_at)")
      .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
      .getRawMany();

    return res.map((item) => ({
      date: item.date,
      averageConfirmationTime: Number(item.avg_confirmation_time),
    }));
  }

  async getP95ConfirmationTime(
    merchantId: string | null,
    period: IAnalyticsPeriod,
  ) {
    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .select(
        'PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY transaction.confirmation_time)',
        'p95_confirmation_time',
      )
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      query.andWhere('transaction.merchant_id = :merchantId', { merchantId });
    }

    const res: { p95_confirmation_time: string } = await query.getRawOne();

    return Number(res.p95_confirmation_time);
  }

  async getP95ConfirmationTimeChartData(
    merchantId: string | null,
    period: IAnalyticsPeriod,
  ) {
    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .select("DATE_TRUNC('day', transaction.created_at)", 'date')
      .addSelect(
        'PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY transaction.confirmation_time)',
        'p95_confirmation_time',
      )
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      query.andWhere('transaction.merchant_id = :merchantId', { merchantId });
    }

    const res: { date: string; p95_confirmation_time: string }[] = await query
      .groupBy("DATE_TRUNC('day', transaction.created_at)")
      .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
      .getRawMany();

    return res.map((item) => ({
      date: item.date,
      p95ConfirmationTime: Number(item.p95_confirmation_time),
    }));
  }

  async getDirectDepositShare(
    merchantId: string | null,
    period: IAnalyticsPeriod,
  ) {
    const totalTransactionsQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      totalTransactionsQuery.andWhere('transaction.merchant_id = :merchantId', {
        merchantId,
      });
    }

    const totalTransactions: { count: string } =
      await totalTransactionsQuery.getRawOne();

    const directDepositTransactionsQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.is_direct_deposit = :isDirectDeposit', {
        isDirectDeposit: true,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      directDepositTransactionsQuery.andWhere(
        'transaction.merchant_id = :merchantId',
        { merchantId },
      );
    }

    const directDepositTransactions: { count: string } =
      await directDepositTransactionsQuery.getRawOne();

    if (Number(totalTransactions.count) === 0) {
      return 0;
    }

    return (
      (Number(directDepositTransactions.count) /
        Number(totalTransactions.count)) *
      100
    );
  }

  async getDirectDepositShareChartData(
    merchantId: string | null,
    period: IAnalyticsPeriod,
  ) {
    const totalTransactionsQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .select("DATE_TRUNC('day', transaction.created_at)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      totalTransactionsQuery.andWhere('transaction.merchant_id = :merchantId', {
        merchantId,
      });
    }

    const totalTransactions: { date: string; count: string }[] =
      await totalTransactionsQuery
        .groupBy("DATE_TRUNC('day', transaction.created_at)")
        .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
        .getRawMany();

    const directDepositTransactionsQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .select("DATE_TRUNC('day', transaction.created_at)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.is_direct_deposit = :isDirectDeposit', {
        isDirectDeposit: true,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      directDepositTransactionsQuery.andWhere(
        'transaction.merchant_id = :merchantId',
        { merchantId },
      );
    }

    const directDepositTransactions: { date: string; count: string }[] =
      await directDepositTransactionsQuery
        .groupBy("DATE_TRUNC('day', transaction.created_at)")
        .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
        .getRawMany();

    const directDepositMap = new Map(
      directDepositTransactions.map((item) => [item.date, Number(item.count)]),
    );

    return totalTransactions.map((item) => {
      const directDepositCount = directDepositMap.get(item.date) || 0;
      const totalCount = Number(item.count);
      const directDepositShare =
        totalCount === 0 ? 0 : (directDepositCount / totalCount) * 100;

      return {
        date: item.date,
        directDepositShare,
      };
    });
  }

  async getAverageOrderValue(merchantId: string, period: IAnalyticsPeriod) {
    const res: { avg_order_value: string } = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('AVG(transaction.amount)', 'avg_order_value')
      .where('transaction.merchant_id = :merchantId', { merchantId })
      .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      })
      .getRawOne();

    return Number(res.avg_order_value);
  }

  async getAverageOrderValueChartData(
    merchantId: string,
    period: IAnalyticsPeriod,
  ) {
    const res: { date: string; avg_order_value: string }[] =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select("DATE_TRUNC('day', transaction.created_at)", 'date')
        .addSelect('AVG(transaction.amount)', 'avg_order_value')
        .where('transaction.merchant_id = :merchantId', { merchantId })
        .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
          startDate: period.startDate,
          endDate: period.endDate,
        })
        .andWhere('transaction.status = :status', {
          status: ETransactionStatus.COMPLETED,
        })
        .groupBy("DATE_TRUNC('day', transaction.created_at)")
        .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
        .getRawMany();

    return res.map((item) => ({
      date: item.date,
      averageOrderValue: Number(item.avg_order_value),
    }));
  }

  async getRepeatCustomerRate(merchantId: string, period: IAnalyticsPeriod) {
    const totalCustomers: { count: string } = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(DISTINCT transaction.metadata)', 'count')
      .where('transaction.merchant_id = :merchantId', { merchantId })
      .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      })
      .getRawOne();

    const repeatCustomers: { count: string } = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(*)', 'count')
      .from((qb) => {
        return qb
          .select('transaction.metadata')
          .from(Transaction, 'transaction')
          .where('transaction.merchant_id = :merchantId', { merchantId })
          .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
            startDate: period.startDate,
            endDate: period.endDate,
          })
          .andWhere('transaction.status = :status', {
            status: ETransactionStatus.COMPLETED,
          })
          .groupBy('transaction.metadata')
          .having('COUNT(*) > 1');
      }, 'repeat_customers')
      .getRawOne();

    if (Number(totalCustomers.count) === 0) {
      return 0;
    }

    return (Number(repeatCustomers.count) / Number(totalCustomers.count)) * 100;
  }

  async getRepeatCustomerRateChartData(
    merchantId: string,
    period: IAnalyticsPeriod,
  ) {
    const totalCustomers: { date: string; count: string }[] =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select("DATE_TRUNC('day', transaction.created_at)", 'date')
        .addSelect('COUNT(DISTINCT transaction.metadata)', 'count')
        .where('transaction.merchant_id = :merchantId', { merchantId })
        .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
          startDate: period.startDate,
          endDate: period.endDate,
        })
        .andWhere('transaction.status = :status', {
          status: ETransactionStatus.COMPLETED,
        })
        .groupBy("DATE_TRUNC('day', transaction.created_at)")
        .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
        .getRawMany();

    const repeatCustomers: { date: string; count: string }[] =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select("DATE_TRUNC('day', repeat_customers.created_at)", 'date')
        .addSelect('COUNT(*)', 'count')
        .from((qb) => {
          return qb
            .select("DATE_TRUNC('day', transaction.created_at)", 'created_at')
            .addSelect('transaction.metadata', 'metadata')
            .from(Transaction, 'transaction')
            .where('transaction.merchant_id = :merchantId', { merchantId })
            .andWhere(
              'transaction.created_at BETWEEN :startDate AND :endDate',
              {
                startDate: period.startDate,
                endDate: period.endDate,
              },
            )
            .andWhere('transaction.status = :status', {
              status: ETransactionStatus.COMPLETED,
            })
            .groupBy("DATE_TRUNC('day', transaction.created_at)")
            .addGroupBy('transaction.metadata')
            .having('COUNT(*) > 1');
        }, 'repeat_customers')
        .groupBy("DATE_TRUNC('day', repeat_customers.created_at)")
        .orderBy("DATE_TRUNC('day', repeat_customers.created_at)", 'ASC')
        .getRawMany();

    const repeatCustomersMap = new Map(
      repeatCustomers.map((item) => [item.date, Number(item.count)]),
    );

    return totalCustomers.map((item) => {
      const repeatCount = repeatCustomersMap.get(item.date) || 0;
      const totalCount = Number(item.count);
      const repeatCustomerRate =
        totalCount === 0 ? 0 : (repeatCount / totalCount) * 100;

      return {
        date: item.date,
        repeatCustomerRate,
      };
    });
  }

  async getFunnelChartData(merchantId: string, period: IAnalyticsPeriod) {
    const totalTransactions: { date: string; count: string }[] =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select("DATE_TRUNC('day', transaction.created_at)", 'date')
        .addSelect('COUNT(*)', 'count')
        .where('transaction.merchant_id = :merchantId', { merchantId })
        .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
          startDate: period.startDate,
          endDate: period.endDate,
        })
        .groupBy("DATE_TRUNC('day', transaction.created_at)")
        .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
        .getRawMany();

    const completedTransactions: { date: string; count: string }[] =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select("DATE_TRUNC('day', transaction.created_at)", 'date')
        .addSelect('COUNT(*)', 'count')
        .where('transaction.merchant_id = :merchantId', { merchantId })
        .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
          startDate: period.startDate,
          endDate: period.endDate,
        })
        .andWhere('transaction.status = :status', {
          status: ETransactionStatus.COMPLETED,
        })
        .groupBy("DATE_TRUNC('day', transaction.created_at)")
        .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
        .getRawMany();

    const failedTransactions: { date: string; count: string }[] =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select("DATE_TRUNC('day', transaction.created_at)", 'date')
        .addSelect('COUNT(*)', 'count')
        .where('transaction.merchant_id = :merchantId', { merchantId })
        .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
          startDate: period.startDate,
          endDate: period.endDate,
        })
        .andWhere('transaction.status = :status', {
          status: ETransactionStatus.FAILED,
        })
        .groupBy("DATE_TRUNC('day', transaction.created_at)")
        .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
        .getRawMany();

    const completedMap = new Map(
      completedTransactions.map((item) => [item.date, Number(item.count)]),
    );
    const failedMap = new Map(
      failedTransactions.map((item) => [item.date, Number(item.count)]),
    );

    return totalTransactions.map((item) => ({
      date: item.date,
      totalTransactions: Number(item.count),
      completedTransactions: completedMap.get(item.date) || 0,
      failedTransactions: failedMap.get(item.date) || 0,
      crRate:
        ((completedMap.get(item.date) || 0) / Number(item.count)) * 100 || 0,
    }));
  }

  async getHourlyHeatmap(merchantId: string, period: IAnalyticsPeriod) {
    const res: { hour: number; day: number; count: string }[] =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select('EXTRACT(HOUR FROM transaction.created_at)', 'hour')
        .addSelect('EXTRACT(DOW FROM transaction.created_at)', 'day')
        .addSelect('COUNT(*)', 'count')
        .where('transaction.merchant_id = :merchantId', { merchantId })
        .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
          startDate: period.startDate,
          endDate: period.endDate,
        })
        .andWhere('transaction.status = :status', {
          status: ETransactionStatus.COMPLETED,
        })
        .groupBy('hour')
        .addGroupBy('day')
        .orderBy('day', 'ASC')
        .addOrderBy('hour', 'ASC')
        .getRawMany();

    return res.map((item) => ({
      hour: Number(item.hour),
      day: Number(item.day),
      count: Number(item.count),
    }));
  }

  async getTopSlowestTransactions(
    merchantId: string | null,
    top: number,
    period: IAnalyticsPeriod,
  ) {
    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      query.andWhere('transaction.merchant_id = :merchantId', { merchantId });
    }

    const res: Transaction[] = await query
      .orderBy('transaction.confirmation_time', 'DESC')
      .limit(top)
      .getMany();

    return res.map(transactionFormatter);
  }

  async getMerchantAlerts(merchantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const alerts: string[] = [];

    // Check CR < 0.70
    const todayTotalTransactions: { count: string } = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(*)', 'count')
      .where('transaction.merchant_id = :merchantId', { merchantId })
      .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: today,
        endDate: tomorrow,
      })
      .getRawOne();

    const todayCompletedTransactions: { count: string } =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select('COUNT(*)', 'count')
        .where('transaction.merchant_id = :merchantId', { merchantId })
        .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
          startDate: today,
          endDate: tomorrow,
        })
        .andWhere('transaction.status = :status', {
          status: ETransactionStatus.COMPLETED,
        })
        .getRawOne();

    const todayCR =
      Number(todayTotalTransactions.count) === 0
        ? 0
        : Number(todayCompletedTransactions.count) /
          Number(todayTotalTransactions.count);

    if (todayCR < 0.7) {
      alerts.push(
        `Conversion rate is below 70%: ${(todayCR * 100).toFixed(2)}%`,
      );
    }

    // Check CR drop >15% d/d
    const yesterdayTotalTransactions: { count: string } =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select('COUNT(*)', 'count')
        .where('transaction.merchant_id = :merchantId', { merchantId })
        .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
          startDate: yesterday,
          endDate: today,
        })
        .getRawOne();

    const yesterdayCompletedTransactions: { count: string } =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select('COUNT(*)', 'count')
        .where('transaction.merchant_id = :merchantId', { merchantId })
        .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
          startDate: yesterday,
          endDate: today,
        })
        .andWhere('transaction.status = :status', {
          status: ETransactionStatus.COMPLETED,
        })
        .getRawOne();

    const yesterdayCR =
      Number(yesterdayTotalTransactions.count) === 0
        ? 0
        : Number(yesterdayCompletedTransactions.count) /
          Number(yesterdayTotalTransactions.count);

    if (yesterdayCR > 0 && (yesterdayCR - todayCR) / yesterdayCR > 0.15) {
      alerts.push(
        `Conversion rate dropped more than 15% day-over-day: ${(((yesterdayCR - todayCR) / yesterdayCR) * 100).toFixed(2)}%`,
      );
    }

    // Check p95_confirmation_time > 120s
    const todayP95: { p95_confirmation_time: string } =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select(
          'PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY transaction.confirmation_time)',
          'p95_confirmation_time',
        )
        .where('transaction.merchant_id = :merchantId', { merchantId })
        .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
          startDate: today,
          endDate: tomorrow,
        })
        .andWhere('transaction.status = :status', {
          status: ETransactionStatus.COMPLETED,
        })
        .getRawOne();

    if (
      todayP95.p95_confirmation_time &&
      Number(todayP95.p95_confirmation_time) > 120
    ) {
      alerts.push(
        `P95 confirmation time exceeds 120 seconds: ${Number(todayP95.p95_confirmation_time).toFixed(2)}s`,
      );
    }

    // Check failed_today > 2× avg(7d)
    const todayFailedTransactions: { count: string } =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select('COUNT(*)', 'count')
        .where('transaction.merchant_id = :merchantId', { merchantId })
        .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
          startDate: today,
          endDate: tomorrow,
        })
        .andWhere('transaction.status = :status', {
          status: ETransactionStatus.FAILED,
        })
        .getRawOne();

    const sevenDaysFailedTransactions: { count: string } =
      await this.transactionRepo
        .createQueryBuilder('transaction')
        .select('COUNT(*)', 'count')
        .where('transaction.merchant_id = :merchantId', { merchantId })
        .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
          startDate: sevenDaysAgo,
          endDate: today,
        })
        .andWhere('transaction.status = :status', {
          status: ETransactionStatus.FAILED,
        })
        .getRawOne();

    const avgSevenDaysFailed = Number(sevenDaysFailedTransactions.count) / 7;

    if (Number(todayFailedTransactions.count) > 2 * avgSevenDaysFailed) {
      alerts.push(
        `Failed transactions today (${todayFailedTransactions.count}) exceed 2x the 7-day average (${avgSevenDaysFailed.toFixed(2)})`,
      );
    }

    return alerts;
  }

  async getFailureShare(merchantId: string | null, period: IAnalyticsPeriod) {
    const totalTransactionsQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      });

    if (merchantId) {
      totalTransactionsQuery.andWhere('transaction.merchant_id = :merchantId', {
        merchantId,
      });
    }

    const totalTransactions: { count: string } =
      await totalTransactionsQuery.getRawOne();

    const failedTransactionsQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.FAILED,
      });

    if (merchantId) {
      failedTransactionsQuery.andWhere(
        'transaction.merchant_id = :merchantId',
        { merchantId },
      );
    }

    const failedTransactions: { count: string } =
      await failedTransactionsQuery.getRawOne();

    if (Number(totalTransactions.count) === 0) {
      return 0;
    }

    return (
      (Number(failedTransactions.count) / Number(totalTransactions.count)) * 100
    );
  }

  async getFailureShareChartData(
    merchantId: string | null,
    period: IAnalyticsPeriod,
  ) {
    const totalTransactionsQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .select("DATE_TRUNC('day', transaction.created_at)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      });

    if (merchantId) {
      totalTransactionsQuery.andWhere('transaction.merchant_id = :merchantId', {
        merchantId,
      });
    }

    const totalTransactions: { date: string; count: string }[] =
      await totalTransactionsQuery
        .groupBy("DATE_TRUNC('day', transaction.created_at)")
        .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
        .getRawMany();

    const failedTransactionsQuery = this.transactionRepo
      .createQueryBuilder('transaction')
      .select("DATE_TRUNC('day', transaction.created_at)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.FAILED,
      });

    if (merchantId) {
      failedTransactionsQuery.andWhere(
        'transaction.merchant_id = :merchantId',
        { merchantId },
      );
    }

    const failedTransactions: { date: string; count: string }[] =
      await failedTransactionsQuery
        .groupBy("DATE_TRUNC('day', transaction.created_at)")
        .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
        .getRawMany();

    const failedMap = new Map(
      failedTransactions.map((item) => [item.date, Number(item.count)]),
    );

    return totalTransactions.map((item) => {
      const failedCount = failedMap.get(item.date) || 0;
      const totalCount = Number(item.count);
      const failureShare =
        totalCount === 0 ? 0 : (failedCount / totalCount) * 100;

      return {
        date: item.date,
        failureShare,
      };
    });
  }

  async getSystemAlerts() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const alerts: string[] = [];

    // Check System CR < 0.80
    const totalTransactions: { count: string } = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: today,
        endDate: tomorrow,
      })
      .getRawOne();

    const completedTransactions: { count: string } = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(*)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: today,
        endDate: tomorrow,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      })
      .getRawOne();

    const systemCR =
      Number(totalTransactions.count) === 0
        ? 0
        : Number(completedTransactions.count) / Number(totalTransactions.count);

    if (systemCR < 0.8) {
      alerts.push(
        `System conversion rate is below 80%: ${(systemCR * 100).toFixed(2)}%`,
      );
    }

    // Check Uptime Score < 97%
    const uptime = systemCR * 100;
    if (uptime < 97) {
      alerts.push(`System uptime score is below 97%: ${uptime.toFixed(2)}%`);
    }

    return alerts;
  }

  async getForecastGMV(merchantId: string | null, period: IAnalyticsPeriod) {
    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .select("DATE_TRUNC('day', transaction.created_at)", 'date')
      .addSelect('SUM(transaction.amount)', 'gmv')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      });

    if (merchantId) {
      query.andWhere('transaction.merchant_id = :merchantId', { merchantId });
    }

    const historicalData: { date: string; gmv: string }[] = await query
      .groupBy("DATE_TRUNC('day', transaction.created_at)")
      .orderBy("DATE_TRUNC('day', transaction.created_at)", 'ASC')
      .getRawMany();

    const data = historicalData.map((item) => ({
      date: item.date,
      gmv: Number(item.gmv),
    }));

    if (data.length === 0) {
      return {
        historical: [],
        forecast: [],
      };
    }

    // Calculate moving average for forecast
    const windowSize = Math.min(7, data.length);
    const forecast: { date: string; forecastGmv: number }[] = [];

    if (data.length >= windowSize) {
      const movingAvg =
        data.slice(-windowSize).reduce((sum, item) => sum + item.gmv, 0) /
        windowSize;

      // Generate forecast for next 7 days
      const lastDate = new Date(data[data.length - 1].date);
      for (let i = 1; i <= 7; i++) {
        const forecastDate = new Date(lastDate);
        forecastDate.setDate(forecastDate.getDate() + i);
        forecast.push({
          date: forecastDate.toISOString(),
          forecastGmv: movingAvg,
        });
      }
    }

    return {
      historical: data,
      forecast,
    };
  }

  async getMerchantClustering(period: IAnalyticsPeriod) {
    // Get merchant metrics
    const merchants = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('transaction.merchant_id', 'merchantId')
      .addSelect('AVG(transaction.amount)', 'aov')
      .addSelect(
        'COUNT(CASE WHEN transaction.status = :completed THEN 1 END)::float / COUNT(*)::float * 100',
        'cr',
      )
      .addSelect(
        'COUNT(CASE WHEN transaction.is_direct_deposit = true AND transaction.status = :completed THEN 1 END)::float / COUNT(CASE WHEN transaction.status = :completed THEN 1 END)::float * 100',
        'directDepositShare',
      )
      .addSelect('AVG(transaction.confirmation_time)', 'avgConfirmTime')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.merchant_id IS NOT NULL')
      .setParameter('completed', ETransactionStatus.COMPLETED)
      .groupBy('transaction.merchant_id')
      .having('COUNT(*) > 10')
      .getRawMany();

    if (merchants.length === 0) {
      return [];
    }

    // Prepare features for clustering
    const features = merchants.map((m) => [
      Number(m.aov) || 0,
      Number(m.cr) || 0,
      Number(m.directDepositShare) || 0,
      Number(m.avgConfirmTime) || 0,
    ]);

    // Normalize features
    const normalized = this.normalizeFeatures(features);

    // K-means clustering (K=3)
    const clusters = this.kMeans(normalized, 3);

    return merchants.map((merchant, idx) => ({
      merchantId: merchant.merchantId,
      aov: Number(merchant.aov) || 0,
      cr: Number(merchant.cr) || 0,
      directDepositShare: Number(merchant.directDepositShare) || 0,
      avgConfirmTime: Number(merchant.avgConfirmTime) || 0,
      cluster: clusters[idx],
    }));
  }

  async getActiveMerchants(period: IAnalyticsPeriod) {
    const res: { count: string } = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(DISTINCT transaction.merchant_id)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      })
      .andWhere('transaction.merchant_id IS NOT NULL')
      .getRawOne();

    return Number(res.count);
  }

  async getActiveMerchantsChartData(period: IAnalyticsPeriod) {
    const res: { date: string; count: string }[] = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select("DATE_TRUNC('month', transaction.created_at)", 'date')
      .addSelect('COUNT(DISTINCT transaction.merchant_id)', 'count')
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      })
      .andWhere('transaction.merchant_id IS NOT NULL')
      .groupBy("DATE_TRUNC('month', transaction.created_at)")
      .orderBy("DATE_TRUNC('month', transaction.created_at)", 'ASC')
      .getRawMany();

    return res.map((item) => ({
      date: item.date,
      activeMerchants: Number(item.count),
    }));
  }

  async getNewMerchants(period: IAnalyticsPeriod) {
    const res: { count: string } = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(DISTINCT first_transactions.merchant_id)', 'count')
      .from((qb) => {
        return qb
          .select('transaction.merchant_id', 'merchant_id')
          .addSelect('MIN(transaction.created_at)', 'first_success_date')
          .from(Transaction, 'transaction')
          .where('transaction.status = :status', {
            status: ETransactionStatus.COMPLETED,
          })
          .andWhere('transaction.merchant_id IS NOT NULL')
          .groupBy('transaction.merchant_id');
      }, 'first_transactions')
      .where('first_success_date BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .getRawOne();

    return Number(res.count);
  }

  async getNewMerchantsCohortHeatmap(period: IAnalyticsPeriod) {
    const firstTransactions = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('transaction.merchant_id', 'merchant_id')
      .addSelect('MIN(transaction.created_at)', 'first_success_date')
      .where('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      })
      .andWhere('transaction.merchant_id IS NOT NULL')
      .andWhere('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .groupBy('transaction.merchant_id')
      .getRawMany();

    const cohortData: {
      cohortMonth: string;
      monthOffset: number;
      activeMerchants: number;
    }[] = [];

    for (const merchant of firstTransactions) {
      const cohortDate = new Date(merchant.first_success_date);
      const cohortMonth = `${cohortDate.getFullYear()}-${String(cohortDate.getMonth() + 1).padStart(2, '0')}`;

      // Get merchant activity for subsequent months
      const activityMonths = await this.transactionRepo
        .createQueryBuilder('transaction')
        .select("DATE_TRUNC('month', transaction.created_at)", 'month')
        .where('transaction.merchant_id = :merchantId', {
          merchantId: merchant.merchant_id,
        })
        .andWhere('transaction.status = :status', {
          status: ETransactionStatus.COMPLETED,
        })
        .andWhere('transaction.created_at >= :firstDate', {
          firstDate: merchant.first_success_date,
        })
        .groupBy("DATE_TRUNC('month', transaction.created_at)")
        .getRawMany();

      activityMonths.forEach((activity) => {
        const activityDate = new Date(activity.month);
        const monthOffset =
          (activityDate.getFullYear() - cohortDate.getFullYear()) * 12 +
          (activityDate.getMonth() - cohortDate.getMonth());

        const existing = cohortData.find(
          (d) => d.cohortMonth === cohortMonth && d.monthOffset === monthOffset,
        );

        if (existing) {
          existing.activeMerchants++;
        } else {
          cohortData.push({
            cohortMonth,
            monthOffset,
            activeMerchants: 1,
          });
        }
      });
    }

    return cohortData;
  }

  async getMerchantRetentionCohorts(period: IAnalyticsPeriod) {
    // Get all merchants with their first transaction date
    const merchantsFirstTransaction = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('transaction.merchant_id', 'merchant_id')
      .addSelect('MIN(transaction.created_at)', 'first_transaction_date')
      .where('transaction.status = :status', {
        status: ETransactionStatus.COMPLETED,
      })
      .andWhere('transaction.merchant_id IS NOT NULL')
      .groupBy('transaction.merchant_id')
      .getRawMany();

    const cohortData: {
      cohortMonth: string;
      monthOffset: number;
      retainedMerchants: number;
      totalMerchantsInCohort: number;
    }[] = [];

    // Group merchants by their signup month
    const cohortGroups = new Map<
      string,
      { merchantId: string; firstDate: Date }[]
    >();

    merchantsFirstTransaction.forEach((merchant) => {
      const firstDate = new Date(merchant.first_transaction_date);
      const cohortMonth = `${firstDate.getFullYear()}-${String(firstDate.getMonth() + 1).padStart(2, '0')}`;

      if (!cohortGroups.has(cohortMonth)) {
        cohortGroups.set(cohortMonth, []);
      }
      cohortGroups.get(cohortMonth)!.push({
        merchantId: merchant.merchant_id,
        firstDate,
      });
    });

    // For each cohort, calculate retention for subsequent months
    for (const [cohortMonth, merchants] of cohortGroups.entries()) {
      const cohortDate = new Date(cohortMonth + '-01');

      // Only process cohorts within the requested period
      if (
        cohortDate < new Date(period.startDate) ||
        cohortDate > new Date(period.endDate)
      ) {
        continue;
      }

      const totalMerchantsInCohort = merchants.length;

      // Check activity for up to 12 months after signup
      for (let monthOffset = 0; monthOffset <= 12; monthOffset++) {
        const checkDate = new Date(cohortDate);
        checkDate.setMonth(checkDate.getMonth() + monthOffset);

        const nextMonth = new Date(checkDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        // Count how many merchants were active in this month
        const activeMerchants = await this.transactionRepo
          .createQueryBuilder('transaction')
          .select('COUNT(DISTINCT transaction.merchant_id)', 'count')
          .where('transaction.merchant_id IN (:...merchantIds)', {
            merchantIds: merchants.map((m) => m.merchantId),
          })
          .andWhere('transaction.status = :status', {
            status: ETransactionStatus.COMPLETED,
          })
          .andWhere('transaction.created_at >= :startDate', {
            startDate: checkDate,
          })
          .andWhere('transaction.created_at < :endDate', {
            endDate: nextMonth,
          })
          .getRawOne();

        cohortData.push({
          cohortMonth,
          monthOffset,
          retainedMerchants: Number(activeMerchants.count),
          totalMerchantsInCohort,
        });
      }
    }

    return cohortData.map((item) => ({
      cohortMonth: item.cohortMonth,
      monthOffset: item.monthOffset,
      retentionRate:
        item.totalMerchantsInCohort === 0
          ? 0
          : (item.retainedMerchants / item.totalMerchantsInCohort) * 100,
      retainedMerchants: item.retainedMerchants,
      totalMerchantsInCohort: item.totalMerchantsInCohort,
    }));
  }

  async getHotspots(period: IAnalyticsPeriod) {
    // Calculate overall average failure share
    const overallStats = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('COUNT(*)', 'total')
      .addSelect(
        'COUNT(CASE WHEN transaction.status = :failed THEN 1 END)',
        'failed',
      )
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .setParameter('failed', ETransactionStatus.FAILED)
      .getRawOne();

    const avgFailureShare =
      Number(overallStats.total) === 0
        ? 0
        : (Number(overallStats.failed) / Number(overallStats.total)) * 100;

    // Get merchant stats
    const merchantStats = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select('transaction.merchant_id', 'merchantId')
      .addSelect('COUNT(*)', 'total')
      .addSelect(
        'COUNT(CASE WHEN transaction.status = :completed THEN 1 END)',
        'completed',
      )
      .addSelect(
        'COUNT(CASE WHEN transaction.status = :failed THEN 1 END)',
        'failed',
      )
      .where('transaction.created_at BETWEEN :startDate AND :endDate', {
        startDate: period.startDate,
        endDate: period.endDate,
      })
      .andWhere('transaction.merchant_id IS NOT NULL')
      .setParameter('completed', ETransactionStatus.COMPLETED)
      .setParameter('failed', ETransactionStatus.FAILED)
      .groupBy('transaction.merchant_id')
      .having('COUNT(*) > 0')
      .getRawMany();

    // Filter hotspots: CR < 0.7 OR failure_share > avg * 2
    const hotspots = merchantStats
      .map((merchant) => {
        const total = Number(merchant.total);
        const completed = Number(merchant.completed);
        const failed = Number(merchant.failed);

        const cr = total === 0 ? 0 : (completed / total) * 100;
        const failureShare = total === 0 ? 0 : (failed / total) * 100;

        return {
          merchantId: merchant.merchantId,
          cr,
          failureShare,
          totalTransactions: total,
        };
      })
      .filter(
        (merchant) =>
          merchant.cr < 70 || merchant.failureShare > avgFailureShare * 2,
      )
      .sort((a, b) => a.cr - b.cr || b.failureShare - a.failureShare);

    return hotspots;
  }

  private normalizeFeatures(features: number[][]): number[][] {
    const numFeatures = features[0].length;
    const mins = new Array(numFeatures).fill(Infinity);
    const maxs = new Array(numFeatures).fill(-Infinity);

    // Find min and max for each feature
    features.forEach((row) => {
      row.forEach((val, idx) => {
        mins[idx] = Math.min(mins[idx], val);
        maxs[idx] = Math.max(maxs[idx], val);
      });
    });

    // Normalize
    return features.map((row) =>
      row.map((val, idx) => {
        const range = maxs[idx] - mins[idx];
        return range === 0 ? 0 : (val - mins[idx]) / range;
      }),
    );
  }

  private kMeans(data: number[][], k: number, maxIterations = 100): number[] {
    const n = data.length;
    const dim = data[0].length;

    // Initialize centroids randomly
    const centroids: number[][] = [];
    const usedIndices = new Set<number>();
    while (centroids.length < k) {
      const idx = Math.floor(Math.random() * n);
      if (!usedIndices.has(idx)) {
        centroids.push([...data[idx]]);
        usedIndices.add(idx);
      }
    }

    let assignments = new Array(n).fill(0);
    let iterations = 0;

    while (iterations < maxIterations) {
      // Assign points to nearest centroid
      const newAssignments = data.map((point) => {
        let minDist = Infinity;
        let cluster = 0;
        centroids.forEach((centroid, idx) => {
          const dist = this.euclideanDistance(point, centroid);
          if (dist < minDist) {
            minDist = dist;
            cluster = idx;
          }
        });
        return cluster;
      });

      // Check convergence
      if (
        assignments.every((val, idx) => val === newAssignments[idx]) ||
        iterations === maxIterations - 1
      ) {
        break;
      }

      assignments = newAssignments;

      // Update centroids
      for (let i = 0; i < k; i++) {
        const clusterPoints = data.filter((_, idx) => assignments[idx] === i);
        if (clusterPoints.length > 0) {
          centroids[i] = new Array(dim).fill(0).map((_, d) => {
            return (
              clusterPoints.reduce((sum, point) => sum + point[d], 0) /
              clusterPoints.length
            );
          });
        }
      }

      iterations++;
    }

    return assignments;
  }

  private euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(
      a.reduce((sum, val, idx) => sum + Math.pow(val - b[idx], 2), 0),
    );
  }
}
