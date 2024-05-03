import { AppDataSource } from "../data-source";
import { Link } from "../entities/shortenerEntity";

export const shortenerRepository = AppDataSource.getRepository(Link)