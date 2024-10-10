// src/interfaces/custom-request.interface.ts

import { Request } from 'express';

export interface CustomRequest extends Request {
    user: {
        uid: string; // Adjust according to your user structure
        // Add other user properties if necessary
    };
}
