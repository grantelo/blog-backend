import { IsNotEmpty } from "class-validator";

export class CreateOnlineUserDto {
    @IsNotEmpty()
    userId: number
}
