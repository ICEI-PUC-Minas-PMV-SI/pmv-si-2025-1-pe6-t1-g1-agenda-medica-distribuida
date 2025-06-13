# MedAgenda Mobile - API Integration

## Backend Connection

The MedAgenda mobile app is now connected to the deployed backend at:
- **Base URL**: `https://med-agenda-backend.vercel.app/`
- **API Documentation**: `https://med-agenda-backend.vercel.app/api-docs/`

## Configuration

### Environment Setup
The API configuration is managed in `config/env.ts`:

```typescript
const ENV = {
  development: {
    API_URL: 'https://med-agenda-backend.vercel.app/api',
    API_TIMEOUT: 15000,
    IMAGE_BASE_URL: 'https://med-agenda-backend.vercel.app/uploads'
  }
  // ... other environments
};
```

### API Service
The main API service is located in `services/api.ts` and includes:
- Automatic token management
- Request/response interceptors
- Error handling
- TypeScript interfaces

## Available Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Doctors
- `GET /doctors` - Get all doctors (with optional specialty filter)
- `GET /doctors/:id` - Get doctor by ID
- `GET /doctors/:id/availability` - Get doctor availability
- `GET /doctors/specialties` - Get available specialties

### Appointments
- `GET /appointments` - Get user appointments
- `POST /appointments` - Create new appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment

### Patients
- `GET /patients` - Get all patients
- `GET /patients/:id` - Get patient by ID
- `PUT /patients/:id` - Update patient

### Profile
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /profile/image` - Update profile image

## Usage Examples

### Testing Connection
```typescript
import { testApiConnection } from './services/apiTest';

const checkConnection = async () => {
  const isConnected = await testApiConnection();
  console.log('API Connected:', isConnected);
};
```

### Authentication
```typescript
import { auth } from './services/api';

// Login
const loginUser = async () => {
  try {
    const response = await auth.login('user@example.com', 'password');
    console.log('Logged in:', response.user.name);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Register
const registerUser = async () => {
  try {
    const user = await auth.register({
      email: 'newuser@example.com',
      password: 'password123',
      name: 'John Doe',
      phone: '+1234567890'
    });
    console.log('Registered:', user.name);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### Fetching Doctors
```typescript
import { doctors } from './services/api';

// Get all doctors
const getAllDoctors = async () => {
  try {
    const doctorsList = await doctors.getAll();
    console.log('Doctors:', doctorsList);
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
  }
};

// Search by specialty
const searchDoctors = async () => {
  try {
    const cardiologists = await doctors.getAll('Cardiology');
    console.log('Cardiologists:', cardiologists);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

### Managing Appointments
```typescript
import { appointments } from './services/api';
import { AppointmentType } from './types/api';

// Create appointment
const createAppointment = async () => {
  try {
    const appointment = await appointments.create({
      doctorId: 'doctor-id-123',
      date: '2024-01-15',
      time: '10:00',
      type: AppointmentType.CONSULTATION,
      notes: 'Regular checkup'
    });
    console.log('Appointment created:', appointment);
  } catch (error) {
    console.error('Failed to create appointment:', error);
  }
};

// Get user appointments
const getUserAppointments = async () => {
  try {
    const userAppointments = await appointments.getAll();
    console.log('User appointments:', userAppointments);
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
  }
};
```

## Error Handling

The API service includes comprehensive error handling:

```typescript
interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
```

Common error scenarios:
- **401 Unauthorized**: Token expired or invalid
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **500 Server Error**: Backend server issues
- **Network Error**: Connection issues

## Authentication Flow

1. **Login**: User provides credentials
2. **Token Storage**: JWT token stored in AsyncStorage
3. **Auto-Injection**: Token automatically added to requests
4. **Auto-Logout**: Token removed on 401 responses

## Testing

Use the provided test utilities:

```typescript
import { testApiConnection, testAvailableEndpoints } from './services/apiTest';

// Test basic connection
await testApiConnection();

// Test all endpoints
await testAvailableEndpoints();
```

## Security Considerations

- All requests use HTTPS
- JWT tokens are securely stored
- Automatic token cleanup on logout
- Request timeout protection (15 seconds)

## Troubleshooting

### Common Issues

1. **Network Errors**
   - Check internet connection
   - Verify backend URL is accessible
   - Check if backend is deployed and running

2. **Authentication Errors**
   - Ensure valid credentials
   - Check if token is expired
   - Verify user registration

3. **CORS Issues**
   - Backend should allow mobile app origins
   - Check backend CORS configuration

### Debug Mode

Enable debug logging by checking the console output when making API calls. All requests and responses are logged in development mode.

## Next Steps

1. Test the connection using the provided test functions
2. Implement authentication in your app screens
3. Use the API services in your React Native components
4. Handle loading states and errors appropriately
5. Implement offline support if needed

For more details, refer to the backend API documentation at: https://med-agenda-backend.vercel.app/api-docs/ 