import {IsEmail, IsNotEmpty, Length} from "class-validator";
import {UniqueOnDatabase} from "../../auth/validations/UniqueValidation";
import {User} from "../entities/user.entity"

export class CreateUserDto {
    @Length(3)
    fullName: string;

    @IsEmail(null, {message: "Неверная почта"})
    @UniqueOnDatabase(User, {
        message: "Пользователь с таким email уже существует"
    })
    email:string;

    activationLink: string = ""

    @Length(6, 32, {message: "Пароль должен быть длинной от 6 до 32 символов"})
    password: string;
}
