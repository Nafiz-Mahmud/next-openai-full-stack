import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const handler = async (req, res) => {
  if (req.method === "GET") {
    res.status(200).send({ msg: "Hello from server." });
  } else if (req.method === "POST") {
    const { prompt, size } = req.body;
    let imageSize;
    switch (size) {
      case "small":
        imageSize = "256x256";
        break;
      case "medium":
        imageSize = "512x512";
        break;
      default:
        imageSize = "1024x1024";
        break;
    }
    try {
      const response = await openai.createImage({
        prompt,
        n: 1,
        size: imageSize,
      });
      const imageUrl = response.data.data[0].url;
      res.status(200).send({ success: true, data: imageUrl, size: imageSize });
    } catch (error) {
      if (error.response) {
        console.log({
          status: error.response.status,
          data: error.response.data,
        });
      } else {
        error.message;
      }
      res
        .status(400)
        .send({ success: false, error: "Image Could not be generated." });
    }
  }
};
export default handler;
