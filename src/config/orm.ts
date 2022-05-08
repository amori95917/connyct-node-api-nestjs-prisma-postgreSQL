import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const options: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'connyct123',
  database: 'connyct-db',
  entities: ['dist/**/*.model.js'],
  synchronize: false,
  logging: true,
};

module.exports = options;
