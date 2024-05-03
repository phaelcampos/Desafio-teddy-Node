import { Router } from 'express';
import shortenerSchema from '../schema/shortenerSchema'
import { createValidator } from 'express-joi-validation'
import ShortenerController from '../controller/shortenerController';
import { tokenValidator } from '../ultils/tokenValidator';

const validator = createValidator();
const shortenerRoute = Router();
// 

/**
 * @openapi
 * /shortener:
 *   post:
 *    summary: Creates a url shortened.
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             link:
 *               type: string
 *     responses:
 *        201:
 *         description: Creates a url shortened 
 */
shortenerRoute.post('/shortener',validator.body(shortenerSchema), async (req, res) => { 
      let validToken
      if(req.headers.authorization){
        validToken = await tokenValidator(req.headers.authorization as string);
      }
      const shortenerController = new ShortenerController();
      const response =await  shortenerController.createUrl(req.body.link, validToken);
      res.statusCode = response.statusCode;
      res.json(response.message)
      res.send()
    }

  );
  /**
   * @openapi
   * /shortener/{url}:
   *   get:
   *     parameters:
   *      - in: path
   *        name: url
   *        required: true
   *        description: Numeric ID of the user to retrieve.
   *        schema:
   *          type: integer
   *     description: Redirects to the destination url based on the shortened url and count the click
   *     responses:
   *        200:
   *         description: Redirects to the destination url 
   *        404:
   *         description: Url not found
   */
  shortenerRoute.get('/shortener/:url', async (req, res) => { 
    const shortenerController = new ShortenerController();
    const response = await  shortenerController.accessShortenedUrl(req.params.url);
    res.statusCode = response.statusCode;
    res.redirect(response.message)
    res.send()
  });

  /**
 * @openapi
 * /shortener/{:urlId}:
 *   put:
 *    summary: updates a url shortened.
 *    parameters:
 *     - in: path
 *       name: url
 *       required: true
 *       description: Numeric ID of the url to edit.
 *       schema:
 *        type: integer
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             link:
 *               type: string
 *     responses:
 *        200:
 *         description: Creates a url shortened 
 *        404:
 *         description: Url not found
 */
  shortenerRoute.put('/shortener/:urlId',validator.body(shortenerSchema), async (req, res) => { 
    const validToken =  await tokenValidator(req.headers.authorization as string);
    const shortenerController = new ShortenerController();
    const response = await  shortenerController.editShortnedUrl(req.params.urlId, req.body.link, validToken);
    res.statusCode = response.statusCode;
    res.json(response.message)
    res.send()
  });
  
  /**
 * @openapi
 * /shortener/{:urlId}:
 *   delete:
 *    summary: updates a url shortened.
 *    parameters:
 *     - in: path
 *       name: url
 *       required: true
 *       description: Numeric ID of the url to edit.
 *       schema:
 *        type: integer
 *    responses:
 *       200:
 *        description: Creates a url shortened 
 *       404:
 *        description: Url not found
 */
  shortenerRoute.delete('/shortener/:urlId',async (req, res) => { 
    const validToken =  await tokenValidator(req.headers.authorization as string);
    const shortenerController = new ShortenerController();
    const response = await  shortenerController.DeleteResult(req.params.urlId, validToken);
    res.statusCode = response.statusCode;
    res.json(response.message)
    res.send()
  });
  
export default shortenerRoute;