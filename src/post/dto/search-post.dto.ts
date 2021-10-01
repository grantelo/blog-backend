import {PartialType} from "@nestjs/mapped-types";
import {CreatePostDto} from "./create-post.dto";

export class SearchPostDto extends PartialType(CreatePostDto) {
    limit: number
}