import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsStrongPassword } from "class-validator";

export class RegisterDto {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @IsString()
    @IsNotEmpty()
    firstname: string

    @IsString()
    @IsNotEmpty()
    lastname: string

    @IsNumber()
    @IsInt()
    @IsPositive()
    @IsOptional()
    age?: number

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    avatar?: string
}