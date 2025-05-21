import axios from 'axios';

async function createAdminUser() {
  try {
    const adminData = {
      name: 'Admin User',
      email: 'admin@medagenda.com',
      password: 'Admin123',
      isAdmin: true
    };

    const response = await axios.post('http://localhost:3000/api/auth/signup', adminData);
    console.log('Admin user created successfully:', response.data);
  } catch (error: any) {
    console.error('Error creating admin user:', error.response?.data || error.message);
  }
}

createAdminUser(); 