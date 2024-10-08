import { GenericContainer, Wait } from 'testcontainers';
import { DEFAULT_START_REDIS_OPTIONS, StartRedisOptions } from './vo';
import { RedisStartedConfig } from './vo';
import { setRedisTestEnv } from './env/set-redis-test-env';
import { StartedRedis } from './vo/redis/started-redis';
import { retrievePortFromBinding } from './utils';

export async function startRedis(
  opts?: Partial<StartRedisOptions>,
): Promise<StartedRedis> {
  console.time(`start redis`);
  const options = {
    ...DEFAULT_START_REDIS_OPTIONS,
    ...opts,
  };

  const container = await new GenericContainer(
    `${options.imageName}:${options.imageTag}`,
  )
    .withExposedPorts(6379)
    .withStartupTimeout(50_000)
    .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
    .start();

  console.timeEnd(`start redis`);

  const redisConfig = {
    port: retrievePortFromBinding(container, 6379),
    host: 'localhost',
  } satisfies RedisStartedConfig;

  await setRedisTestEnv(redisConfig);

  return {
    container,
    redisConfig,
  } satisfies StartedRedis;
}
