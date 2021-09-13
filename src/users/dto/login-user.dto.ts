import {IsEmail, Length} from "class-validator";

export class LoginUserDto {
    @IsEmail(null, {message: "Некорректный адрес электроной почты"})
    email: string

    @Length(6, 32, {message: "Пароль должен быть длинной от 6 до 32 символов"})
    password: string
}