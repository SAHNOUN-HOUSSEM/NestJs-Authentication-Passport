import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { User } from 'src/schemas';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { IUser, PersistedUser } from './types';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) { }

    async validateUsersCredentials(email: string, pass: string) {
        const user = await this.userModel.findOne({ email })
        if (!user)
            return null
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch)
            return null
        const result: PersistedUser = {
            userId: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        }
        return result;
    }

    async register(registerDto: RegisterDto) {
        const userWithSameEmail = await this.userModel.findOne({ email: registerDto.email })
        if (userWithSameEmail)
            throw new BadRequestException("there is a user with the same email")
        const hash = await bcrypt.hash(registerDto.password, 10);
        const newUser = new this.userModel(registerDto)
        newUser.password = hash
        const savedUser = await newUser.save()
        const result: PersistedUser = {
            userId: savedUser.id,
            email: savedUser.email,
            firstname: savedUser.firstname,
            lastname: savedUser.lastname,
        }
        return result
    }

    async login(user: IUser) {
        const accessToken = await this.createAccessToken(user);
        const refreshToken = await this.createRefreshToken(user.userId)
        return { accessToken, refreshToken }
    }

    async createAccessToken(user: IUser) {
        const payload = { username: user.email, sub: user.userId };
        return this.jwtService.sign(payload);
    }

    async createRefreshToken(userId: string) {
        const refreshTokenId = randomUUID();
        return this.jwtService.sign({ userId, refreshTokenId }, { expiresIn: '7d' });
    }

    decodeRefreshToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}