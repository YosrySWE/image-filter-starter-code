import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const image_url = req.query.image_url.toString();
    //    1. validate the image_url query
    if (image_url) {
      try {
        //    2. call filterImageFromURL(image_url) to filter the image
        const image = await filterImageFromURL(image_url);
        console.log(`filteredimage: ${image}`);
        //    3. send the resulting file in the response
        res.sendFile(image, (err) => {
          if (err) {
            console.log(err);
            res.status(409).json((err as Error).message);
          } else {
            const files = [image];

            //    4. deletes any files on the server on finish of the response
            deleteLocalFiles(files);
          }
        });
      } catch (err) {
        res.status(500).json((err as Error).message);
      }
    } else {
      res.status(400).send("image url is required!");
    }
  });

  /**************************************************************************** */
  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
