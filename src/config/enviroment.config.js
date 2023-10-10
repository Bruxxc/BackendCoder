import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
program.option('--mode <mode>', 'PRODUCTION', 'DEVELOPMENT');
program.parse();

dotenv.config({
  path: program.opts().mode === 'DEVELOPMENT' ? './.env.development' : program.opts().mode === 'QA' ? './.env.qa' : './.env.production',
});

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  logger: process.env.LOGGER,
  api_url: process.env.API_URL,
  stripe_key: process.env.STRIPE_KEY,
  stripe_p_key: process.env.STRIPE_P_KEY
};

