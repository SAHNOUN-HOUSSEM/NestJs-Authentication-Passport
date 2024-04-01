import { Controller, Request, Post, UseGuards, Get, Res, Req, Body } from '@nestjs/common';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { AuthService } from './auth.service';
import { Cookies, UserFromReq } from './decorators';
import { Response } from 'express';
import { User } from 'src/schemas';
import { PersistedUser } from './types';
import { RegisterDto } from './dto';

@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/register")
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto)
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(
        @UserFromReq() user: PersistedUser,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken, refreshToken } = await this.authService.login({ email: user.email, userId: user.userId });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
        return ({ accessToken });
    }

    @Post('refresh')
    async refresh(
        @Res({ passthrough: true }) res: Response,
        @Cookies('refreshToken') oldRefreshToken: string
    ) {
        const { userId, refreshTokenId } = this.authService.decodeRefreshToken(oldRefreshToken);



        const newAccessToken = await this.authService.createAccessToken(userId);
        const newRefreshToken = await this.authService.createRefreshToken(userId);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        return res.send({ accessToken: newAccessToken });
    }


    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async profile(
        @Request() req
    ) {
        return req.user
    }



    @UseGuards(JwtAuthGuard)
    @Get("/me")
    async me(
        @UserFromReq() user: PersistedUser
    ) {
        return user
    }
}