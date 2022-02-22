import {IsArray, IsOptional, IsString} from "class-validator";

export interface OutputBlockData {
    id?: string,
    type: any
    data: any
    tune?: any
}

export class CreatePostDto {
    @IsString()
    title: string

    @IsArray()
    body: OutputBlockData[]

    @IsOptional()
    tags: string
}
