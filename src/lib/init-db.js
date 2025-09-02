import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await query({ query: schema, values: [] });
    
    console.log('Database initialized successfully!');
    
    // Insert sample data
    console.log('Inserting sample data...');
    
    const sampleSchools = [
      ['Hyderabad Public School', 'Begumpet', 'Hyderabad', 'Telangana', '4023456789', 'info@hps.edu', '/schoolImages/hyderabad_public.jpg'],
      ['Mayo College', 'Ajmer', 'Ajmer', 'Rajasthan', '1452345678', 'info@mayo.edu', '/schoolImages/mayo_college.jpg'],
      ['The Lawrence School', 'Sanawar', 'Solan', 'Himachal Pradesh', '1792345678', 'info@lawrence.edu', '/schoolImages/lawrence_school.jpg'],
      ['Scindia School', 'Gwalior Fort', 'Gwalior', 'Madhya Pradesh', '7512345678', 'info@scindia.edu', '/schoolImages/scindia_school.jpg'],
      ['Rishi Valley School', 'Rishi Valley', 'Chittoor', 'Andhra Pradesh', '8571234567', 'info@rishivalley.edu', '/schoolImages/rishi_valley.jpg'],
      ['St. Paul\'s School', 'Darjeeling', 'Darjeeling', 'West Bengal', '3541234567', 'info@stpauls.edu', '/schoolImages/st_pauls.jpg'],
      ['Welham Girls\' School', 'Dehradun', 'Dehradun', 'Uttarakhand', '1352345679', 'info@welham.edu', '/schoolImages/welham_girls.jpg'],
      ['Yadavindra Public School', 'Mohali', 'Mohali', 'Punjab', '1722345678', 'info@yps.edu', '/schoolImages/yadavindra_public.jpg'],
      ['Sainik School', 'Kazhakootam', 'Thiruvananthapuram', 'Kerala', '4712345678', 'info@sainik.edu', '/schoolImages/sainik_school.jpg'],
      ['Loyola School', 'Thiruvananthapuram', 'Thiruvananthapuram', 'Kerala', '4712345679', 'info@loyola.edu', '/schoolImages/loyola_school.jpg']
    ];
    
    for (const school of sampleSchools) {
      await query({
        query: `
          INSERT INTO schools (name, address, city, state, contact, email_id, image)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        values: school
      });
    }
    
    console.log('Sample data inserted successfully!');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Run the initialization
initializeDatabase();