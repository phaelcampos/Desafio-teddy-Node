import userInterface from '../interfaces/userInterface';
import loginInterface from '../interfaces/loginInterface';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { BadRequestError, ConflictError, UnauthorizedError } from '../helpers/apiErrors';
import { userRepository } from '../repositories/userRepository';
import { shortenerRepository } from '../repositories/shortenerRepository';

export default class UserBusiness {
  async createUser(user: userInterface){
      const emailExists = await userRepository.findOneBy({
          email: user.email
      })
      if ( emailExists ) throw new ConflictError("E-mail já cadastrado");

      const usernameExists = await userRepository.findOneBy({
          username: user.username
      })
      if ( usernameExists ) throw new ConflictError("Nome de usuário já cadastrado" );

      const hashPassword = await bcrypt.hash(user.password, 10);

      user.password = hashPassword;

      const userTocreate = userRepository.create(user);
      await userRepository.save(userTocreate);
      
      return {
          statusCode: 201,
          message: "Usuário criado com sucesso"
      }
  }   

  async login(login: loginInterface){
      const userExists = await userRepository.findOneBy({
          username: login.username
      })
      console.log(userExists)
      if ( !userExists ) throw new BadRequestError("Usuário ou senha inválidos")
      login.id = userExists.id
      
      const comparedPassword = await bcrypt.compareSync(login.password, userExists.password);
      if ( !comparedPassword ) throw new BadRequestError("Usuário ou senha inválidos");
      
      const token = JWT.sign(login, process.env.SECRET ?? '' , { expiresIn: '5h' })
      return {
          statusCode: 200,
          token,
      }
  }   

  async authenticate(token:string){
      try{
            const newToken = token.substring(7, token.length);
            await JWT.verify(newToken, process.env.SECRET ?? '' , );
            const decodedToken = JWT.decode(newToken);
            return decodedToken;
      }catch(error: any){
          console.log(error);
          throw new UnauthorizedError(error.message);
      }
  }

  async listUrl(userId: number, token: any){
    if (userId != token.id){
      return {
        statusCode: 400,
        message:  "Usuário não pode acessar estas urls"
      }
    }
    const response = await shortenerRepository.find({
      select:{
        id: true,
        url:true,
        shortened_url: true,
        access_count: true
      },
      where:{
        user_id: userId,
        deleted: false
      }
   })
   if(!response) return {
    statusCode: 404,
    message:  "Usuário não encontrado"
  }
    return {
      statusCode: 200,
      message:  response
    }
  }
};