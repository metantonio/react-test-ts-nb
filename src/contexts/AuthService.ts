export const authService = {
    async login(username: string, password: string) {
        // Replace this with your actual login logic
        console.log(username, password)
        return Promise.resolve({ user: { id: '1', name: 'Test User' }, token: 'test-token' });
    },

    async logout() {
        // Replace this with your actual logout logic
        return Promise.resolve();
    }
};