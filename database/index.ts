import { DatabasePool, createTypeParserPreset } from 'slonik';
import { 
	createPool, 
} from 'slonik';

const DB_URL = process.env.DB_URL || 'postgres://postgres:postgres@db:5432/postgres';
const CA_CERT = process.env.CA_CERT
let pool: DatabasePool;

const baseConfig = {
  typeParsers:[]
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
