import { DatabasePool, sql } from 'slonik';
import { 
	createPool,
    type Interceptor,
    type QueryResultRow,
    SchemaValidationError
} from 'slonik';
import {
  createFieldNameTransformationInterceptor
} from 'slonik-interceptor-field-name-transformation';

const DB_URL = process.env.DB_URL || 'postgres://postgres:postgres@db:5432/postgres';
const CA_CERT = process.env.CA_CERT
let pool: DatabasePool;

const customTypeParsers = [
  {
    name: 'timestamptz',
    parse: (value: string) => {
      return new Date(value).toISOString();
    }
  }
];

const baseConfig = {
  interceptors: [
    createFieldNameTransformationInterceptor({
      format: 'CAMEL_CASE'
    }),
    createResultParserInterceptor()
  ],
  typeParsers: customTypeParsers
}

const envConfigs: {[env:string]:{}} = {
  production: {
    ssl: {
      ca: CA_CERT
    }
  },
  development: {}
};

const dbConfig = {...baseConfig, ...envConfigs[process.env.NODE_ENV || 'development']};

export async function getPool(){
	if (pool) return pool;

  console.log('Creating DB pool...')
  try{
    pool = await createPool(DB_URL, dbConfig)
    console.log('DB pool created')
  }catch(e){
    console.log('Error creating DB pool: ', JSON.stringify(e))
  }

	return pool;
}

export async function resetDatabase(){
  const pool = await getPool();
  await pool.connect(
    async (connection) => await connection.query(sql.unsafe`TRUNCATE drafts CASCADE`)
  )
  await pool.connect(
    async (connection) => await connection.query(sql.unsafe`TRUNCATE proposals CASCADE`)
  )
  await pool.connect(
    async (connection) => await connection.query(sql.unsafe`TRUNCATE votes CASCADE`)
  )
}

function createResultParserInterceptor(): Interceptor {
  return {
    // If you are not going to transform results using Zod, then you should use `afterQueryExecution` instead.
    // Future versions of Zod will provide a more efficient parser when parsing without transformations.
    // You can even combine the two – use `afterQueryExecution` to validate results, and (conditionally)
    // transform results as needed in `transformRow`.
    transformRow: async (executionContext, actualQuery, row) => {
      const { log, resultParser } = executionContext;

      if (!resultParser) {
        return row;
      }

      // It is recommended (but not required) to parse async to avoid blocking the event loop during validation
      const validationResult = await resultParser.safeParseAsync(row);

      if (!validationResult.success) {
        console.log('Validation failed:', validationResult.error.issues);
        throw new SchemaValidationError(
            actualQuery,
            row,
            validationResult.error.issues
        );
      }

      return validationResult.data as QueryResultRow;
    },
  };
}
