import Database from 'better-sqlite3';
import type { KyselyConfig, LogEvent, Logger } from 'kysely';
import { Kysely, SqliteDialect } from 'kysely';
import type { DatabaseSettings } from 'csdm/node/settings/settings';
import type { Database } from './schema';

export let db: Kysely<Database>;

export function createDatabaseConnection(settings: DatabaseSettings) {
  const dialect = new SqliteDialect({
    database: new Database(settings.database),
  });

  let loggerFunction: Logger;
  if (process.env.LOG_DATABASE_QUERIES) {
    loggerFunction = (event: LogEvent) => {
      logger.log(event.query.sql);
      logger.log(event.query.parameters);
      if (event.level === 'error') {
        logger.log('Failed query:');
        logger.error(event.error);
      }
    };
  } else {
    loggerFunction = (event: LogEvent) => {
      if (event.level === 'error') {
        logger.log('Failed query:');
        logger.error(event.error);
      }
    };
  }

  const config: KyselyConfig = {
    dialect,
    log: loggerFunction,
  };

  db = new Kysely<Database>(config);
}
