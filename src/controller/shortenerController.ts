import { response } from 'express';
import { shortenerRepository } from '../repositories/shortenerRepository';
import userInterface from '../interfaces/userInterface';


export default class shortenerController {
  
  async createUrl(receivedUrl: string, validToken?: any ){
    const newUrl = this.generateString();
    await shortenerRepository.save({
      user_id: validToken.id? validToken.id : null,
      url: receivedUrl,
      shortened_url: newUrl
    })
    return {
      statusCode: 201,
      message: "Usuário criado com sucesso"
    }
  } 

  async accessShortenedUrl(url:string){
    const response = await shortenerRepository.findOne({
      select:{
        id: true,
        url:true,
        access_count: true
      },
      where:{
        shortened_url:url,
        deleted: false
      }
   })
   if(!response)return {
    statusCode: 404,
    message:  "Url não encontrada"
  }
   await shortenerRepository.save({
    id: response.id,
    access_count: response.access_count + 1
   })
    return {
      statusCode: 200,
      message:  response.url
    }
  }


  async editShortnedUrl(url:string, newUrl:string, token: any){

    const response = await shortenerRepository.findOne({
      select:{
        id: true,
        user_id: true,
      },
      where:{
        shortened_url: url,
        deleted: false
      }
   })

   if(!response) return {
    statusCode: 404,
    message:  "Url não encontrada"
  }

  if (response.user_id != token.id){
    return {
      statusCode: 400,
      message:  "Usuário não pode editar esta urls"
    }
  }

   await shortenerRepository.save({
      id: response.id,
      url: newUrl
   })
    return {
      statusCode: 200,
      message:  response.url
    }
  }

  generateString() {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  async DeleteResult(url:string, token: any){
    const response = await shortenerRepository.findOne({
      select:{
        id: true,
        user_id: true,
      },
      where:{
        shortened_url:url
      }
   })
   if(!response){
    return {
      statusCode: 404,
      message:  "Url não encontrada"
    }
   }
   if (response.user_id != token.id){
    return {
      statusCode: 400,
      message:  "Usuário não pode deletar esta urls"
    }
  }

   await shortenerRepository.save({
    id: response.id,
    deleted: true
    })
    return {
      statusCode: 200,
      message:  url
}
  }

};