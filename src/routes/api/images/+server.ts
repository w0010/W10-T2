// src/routes/api/images/+server.ts
import fs from 'fs/promises';
import path from 'path';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const imagesDir = path.join('static', 'images'); // Ensure the path is correct
    try {
        const files = await fs.readdir(imagesDir);
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        const images = imageFiles.map(file => `/images/${file}`);


        // Convert the array of images to JSON and return a Response object
        return new Response(JSON.stringify({ images }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error(error);
        // Return a Response object for errors as well
        return new Response(JSON.stringify({ error: 'Error reading the images directory.' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
