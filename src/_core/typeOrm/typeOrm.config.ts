import { DataSource, DataSourceOptions } from 'typeorm';
import { name, version } from '../../../package.json';

import configuration from '../config/configuration';

const config = configuration();

export const typeOrmOptios: DataSourceOptions = {
  type: 'postgres',
  applicationName: `${name}_${version}`,
  url: config.database.url,
  schema: config.database.schema,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  migrationsRun: true,
};

export default new DataSource(typeOrmOptios);
