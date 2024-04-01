import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Get()
    async index() {
        return this.usersService.index();
    }

    @SkipThrottle({ default: false })
    @Get(':id')
    async details(
        @Param("id") id: string
    ) {
        return this.usersService.details(id);
    }
}
