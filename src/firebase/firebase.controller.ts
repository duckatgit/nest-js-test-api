import { Controller, Post, Body, Get } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('auth')
export class FirebaseController {
    constructor(private readonly firebaseService: FirebaseService) { }

    // Login API for email/password
    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        return this.firebaseService.signIn(email, password);
    }

    // Sign-up API for email/password
    @Post('signup')
    async signUp(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        return this.firebaseService.signUp(email, password);
    }

    @Get('users')
    async listUsers() {
        const users = await this.firebaseService.listAllUsers();
        return users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            disabled: user.disabled
        }));
    }
}
