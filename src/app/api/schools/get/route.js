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
    
    let sql = 'SELECT * FROM schools WHERE 1=1';
    let params = [];
    
    if (search) {
      sql += ' AND (name LIKE ? OR address LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    if (city) {
      sql += ' AND city = ?';
      params.push(city);
    }
    
    if (state) {
      sql += ' AND state = ?';
      params.push(state);
    }
    
    // Get total count for pagination
    let countSql = sql.replace('SELECT * FROM', 'SELECT COUNT(*) as total FROM');
    const countResult = await query({ query: countSql, values: [...params] });
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    // Add pagination to the main query
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    // Only pass params if there are any
    const schools = await query({
      query: sql,
      values: params.length > 0 ? params : []
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