import { AppDataSource } from "../data-source";
import { User } from "../entities/UserEntity";

export const userRepository = AppDataSource.getRepository(User)