import { PartialType } from "@nestjs/mapped-types";
import { User } from "src/schemas";

export class PersistedUser extends PartialType(User) {
    userId: string
}