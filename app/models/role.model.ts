import { User } from "./user.model";

export class Role {

    public roleID: number;
    public name: string;
    public description: string;
    public users: User[];
}