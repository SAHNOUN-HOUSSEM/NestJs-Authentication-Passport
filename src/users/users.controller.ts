import { Controller, Get, Ip, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { SkipThrottle } from '@nestjs/throttler';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@SkipThrottle()
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private logger: MyLoggerService
    ) {
        this.logger.setContext(UsersController.name);
    }

    @Get()
    async index(
        @Ip() ip: string
    ) {
        this.logger.log(`Request for ALL Users\t${ip}`, UsersController.name)
        return this.usersService.index();
    }

    @SkipThrottle({ default: false })
    @Get(':id')
    async details(
        @Param("id") id: string,
        @Ip() ip: string
    ) {
        this.logger.log(`Request for Single Users\t${ip}`, UsersController.name)
        return this.usersService.details(id);
    }
}
