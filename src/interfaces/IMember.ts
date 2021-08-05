
import { Member } from "../entities/Member";
export interface IMember {
    enroll(): Promise<boolean>
}