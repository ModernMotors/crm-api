import initializeDatabase from './index.js';
import { seedDatabase } from './seed.js';

const migrate = async () => {
  try {
    console.log('Starting database migration...');
    await initializeDatabase();
    console.log('Migration completed successfully!');
    
    // Seed database with initial data
    console.log('Starting database seeding...');
    await seedDatabase();
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
