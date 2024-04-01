import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) { }

    index() {
        return this.userModel.find()
    }



    async details(id: string) {
        const user = await this.userModel.findById(id)
        if (!user)
            throw new NotFoundException("User not found")
        return user
    }

}