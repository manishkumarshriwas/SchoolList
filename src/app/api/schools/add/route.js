import { query } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    // Extract form fields
    const name = formData.get('name');
    const address = formData.get('address');
    const city = formData.get('city');
    const state = formData.get('state');
    const contact = formData.get('contact');
    const email_id = formData.get('email_id');
    const image = formData.get('image');
    
    // Validation
    if (!name || !address || !city || !state || !contact || !email_id) {
      return Response.json({ message: 'All fields are required' }, { status: 400 });
    }
    
    if (contact.length !== 10 || isNaN(contact)) {
      return Response.json({ message: 'Contact number must be 10 digits' }, { status: 400 });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_id)) {
      return Response.json({ message: 'Invalid email format' }, { status: 400 });
    }
    
    let imagePath = '';
    
    // Handle image upload
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generate unique filename
      const fileName = `${Date.now()}_${image.name}`;
      const filePath = path.join(process.cwd(), 'public', 'schoolImages', fileName);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      require('fs').mkdirSync(dir, { recursive: true });
      
      // Save the file
      await writeFile(filePath, buffer);
      imagePath = `/schoolImages/${fileName}`;
    }
    
    // Insert into database
    const result = await query({
      query: `
        INSERT INTO schools (name, address, city, state, contact, email_id, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      values: [name, address, city, state, contact, email_id, imagePath],
    });
    
    return Response.json({ 
      message: 'School added successfully',
      imagePath: imagePath
    }, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}