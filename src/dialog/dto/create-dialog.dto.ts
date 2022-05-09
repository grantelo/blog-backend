import { IsNotEmptyObject } from "class-validator";

export class CreateDialogDto {
    @IsNotEmptyObject()
    users: number[];
}
