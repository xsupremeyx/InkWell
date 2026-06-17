const BASE_URL = "http://localhost:3000/api/v1";

export async function apiFetch(endpoint, options = {}){
    const token = localStorage.getItem("token");

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => null);

    if(!response.ok){
        const error = new Error(data?.message || 'API request failed');
        error.status = response.status;
        error.errors = data?.errors || null;
        throw error;
    }

    return data;
}