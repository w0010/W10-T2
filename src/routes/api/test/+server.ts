import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const body = { message: 'Test endpoint works' };

    return new Response(JSON.stringify(body), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
