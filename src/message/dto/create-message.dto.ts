import { IsNotEmpty } from "class-validator";

export class CreateMessageDto {
    @IsNotEmpty()
    text: string

    @IsNotEmpty()
    dialogId: number

    userId: number
}
