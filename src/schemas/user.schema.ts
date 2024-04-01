import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    @Prop({
        required: true,
        unique: true
    })
    email: string;

    @Prop({
        required: true,
    })
    password: string;

    @Prop({
        required: true,
    })
    firstname: string

    @Prop({
        required: true,
    })
    lastname: string

    @Prop({
        required: false,
        isInteger: true,
    })
    age?: number

    @Prop({
        required: false,
    })
    avatar?: string

}


export const UserSchema = SchemaFactory.createForClass(User)