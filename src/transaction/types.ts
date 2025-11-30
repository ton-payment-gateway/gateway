export enum ETransactionStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum EForecastModel {
  HoltWinters = 'holt_winters',
  Sarima = 'sarima',
  Prophet = 'prophet',
}

export interface IForecastResponse {
  forecast: { date: string; value: number }[];
}
