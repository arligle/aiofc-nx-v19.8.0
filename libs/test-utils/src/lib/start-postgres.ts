import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { buildTypeormConfigService } from './typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getTransactionalContext } from 'typeorm-transactional/dist/common';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { StartDbOptions, StartedDb } from './vo';
import { DEFAULT_START_POSTGRES_OPTIONS } from './vo/start-postgres-default-options';
import { setTestEnvironmentForTypeorm } from './env/set-typeorm-test-env';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';
import { AbstractStartedContainer } from 'testcontainers';
import { retrievePortFromBinding } from './utils';
import { StartedTestContainer } from 'testcontainers/build/test-container';

export async function startPostgres(
  opts?: Partial<StartDbOptions>,
): Promise<StartedDb> {
  const options = {
    ...DEFAULT_START_POSTGRES_OPTIONS,
    ...opts,
  };

  console.time(`start postgres db`);

  const pg = await new PostgreSqlContainer(`postgres:${options.imageTag}`)
    .withExposedPorts(5432)
    .withDatabase(options.dbName)
    .withUsername(options.username)
    .withPassword(options.password)
    .start();

  console.timeEnd(`start postgres db`);

  const typeormOptions = {
    port: retrievePortFromBinding(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      pg.startedTestContainer as never as StartedTestContainer,
      5432,
    ),
    username: pg.getUsername(),
    password: pg.getPassword(),
    database: pg.getDatabase(),
    synchronize: !options.runMigrations,
    migrationsRun: options.runMigrations,
    dropSchema: true,
    type: 'postgres',
    ...options.additionalTypeOrmModuleOptions,
  } as TypeOrmModuleOptions & PostgresConnectionCredentialsOptions;

  if (options.setupTransactionsManagement && !getTransactionalContext()) {
    initializeTransactionalContext();
  }

  await setTestEnvironmentForTypeorm(typeormOptions);

  return {
    container: pg as unknown as AbstractStartedContainer,
    typeormOptions,
    TypeOrmConfigService: buildTypeormConfigService(typeormOptions),
  };
}
