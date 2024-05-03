import UserBusiness from "../controller/userController";

export async function tokenValidator(token:string) {
  const userBusiness = new UserBusiness();
  return await userBusiness.authenticate(token);
}