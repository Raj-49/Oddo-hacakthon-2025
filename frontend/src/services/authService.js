const API_URL = 'http://localhost:5000/api';

class AuthService {
    async login(email, password) {
        console.log('Sending login request:', { email, password });
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to login');
        }

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    }

    async register(username, email, password) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to register');
        }

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    isAuthenticated() {
        return !!this.getCurrentUser()?.token;
    }

    getToken() {
        return this.getCurrentUser()?.token;
    }

    hasRole(role) {
        const user = this.getCurrentUser();
        return user?.user?.role === role;
    }
}

export const authService = new AuthService();
