import { useState, useCallback } from 'react';
export function useFetch() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fetchData = useCallback(async (url, options = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const { method = 'GET', headers = {}, body } = options;
            const config = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            };
            if (body) {
                config.body = JSON.stringify(body);
            }
            const response = await fetch(url, config);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: `Request failed with status ${response.status}`,
                }));
                throw new Error(errorData.message || 'An error occurred');
            }
            const responseData = await response.json();
            setData(responseData);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    return { data, error, isLoading, fetchData };
}
