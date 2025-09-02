import mysql from 'mysql2/promise';

export async function query({ query, values = [] }) {
  let dbconnection;
  
  try {
    dbconnection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Always use query() method for better compatibility
    // Build the query with escaped values
    let finalQuery = query;
    if (values && values.length > 0) {
      // Replace each ? with the escaped value
      values.forEach((value, index) => {
        const escapedValue = dbconnection.escape(value);
        finalQuery = finalQuery.replace('?', escapedValue);
      });
    }
    
    const [results] = await dbconnection.query(finalQuery);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Database query failed: ${error.message}`);
  } finally {
    if (dbconnection) {
      await dbconnection.end();
    }
  }
}