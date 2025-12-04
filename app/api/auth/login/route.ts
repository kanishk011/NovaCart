import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Replace this with your actual API call to your backend
    // For demonstration, this is a mock implementation
    if (email && password) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login - replace with actual API call
      // Example: const response = await fetch('https://your-api.com/login', {...})

      if (email === 'demo@example.com' && password === 'demo123') {
        const user = {
          id: '1',
          email: email,
          name: 'Demo User',
        };

        return NextResponse.json({
          success: true,
          user,
          token: 'mock-jwt-token',
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: 'Missing email or password' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
