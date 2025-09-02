import { query } from '@/lib/db';

export async function GET(req) {
  try {
    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;
    
    // Build WHERE clause dynamically
    let whereClause = '';
    let countWhereClause = '';
    
    if (search) {
      const searchEscaped = `%${search}%`;
      whereClause += ` AND (name LIKE '${searchEscaped}' OR address LIKE '${searchEscaped}')`;
      countWhereClause += ` AND (name LIKE '${searchEscaped}' OR address LIKE '${searchEscaped}')`;
    }
    
    if (city) {
      whereClause += ` AND city = '${city}'`;
      countWhereClause += ` AND city = '${city}'`;
    }
    
    if (state) {
      whereClause += ` AND state = '${state}'`;
      countWhereClause += ` AND state = '${state}'`;
    }
    
    // Get total count for pagination
    const countSql = `SELECT COUNT(*) as total FROM schools WHERE 1=1 ${countWhereClause}`;
    const countResult = await query({ 
      query: countSql,
      values: []
    });
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    // Get schools with pagination
    const sql = `SELECT * FROM schools WHERE 1=1 ${whereClause} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
    
    const schools = await query({
      query: sql,
      values: []
    });
    
    return Response.json({
      schools,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}