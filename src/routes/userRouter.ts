import { Router } from 'express';
import userSchema from '../schema/userSchema'
import { createValidator } from 'express-joi-validation'
import UserBusiness from '../controller/userController';
import loginSchema from '../schema/loginSchema';
import { tokenValidator } from '../ultils/tokenValidator';

const validator = createValidator();
const userRouter = Router();

/**
 * @openapi
 * /user:
 *   post:
 *    summary: Creates a user.
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *             email:
 *               type: string
 *     responses:
 *        201:
 *         description: Creates a user 
 */
userRouter.post('/user',validator.body(userSchema), async (req, res) => { 
  const userBusiness = new UserBusiness();
  const response = await userBusiness.createUser(req.body);
  res.statusCode = response.statusCode;
  res.json(response.message)
  res.send()
  });

/**
 * @openapi
 * /user/login:
 *   post:
 *    summary: Creates a user.
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *        200:
 *         description: Returns users token
 */
 userRouter.post('/user/login',validator.body(loginSchema), async (req, res) => { 
    const userBusiness = new UserBusiness();
    const response = await userBusiness.login(req.body);
    res.statusCode = response.statusCode;
    res.json({
      message: response.token
    })
    res.send()
  });
  /**
   * @openapi
   * /shortener/{userID}:
   *   get:
   *     parameters:
   *      - in: path
   *        name: userID
   *        required: true
   *        description: Numeric ID of the user to retrieve.
   *        schema:
   *          type: integer
   *     description: Redirects to the destination url based on the shortened url and count the click
   *     responses:
   *        200:
   *         description: Returns a list of shortened urls of a specific user
   *        404:
   *         description: Url not found
   */
  userRouter.get('/user/:userId', async (req, res) => {
    const validToken = await tokenValidator(req.headers.authorization as string);
    const userBusiness = new UserBusiness();
    const intUserId = parseInt(req.params.userId)
    const response = await userBusiness.listUrl(intUserId, validToken);
    res.statusCode = response.statusCode;
    res.json(response.message)
    res.send()
  });

export default userRouter;