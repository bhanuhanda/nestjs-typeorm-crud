import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'db', // name of the DB sqlite saves
  entities: ['dist/src/**/*.entity.js'],
  synchronize: false, // sync: true shouldn't be used in production, coz it auto updates DB schema
  migrations: ['dist/src/db/migrations/*.js'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
};
export default config;
