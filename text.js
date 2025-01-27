import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.post("/", (req, res) => {
  if (req.body["hello"] === "") {
    return res.status(400).send({ error: "Your hello needs to have a hello" });
  }
  if (req.body["hello"] === "hello") {
    return res.status(200).send({ message: "Hello" });
  }
  if (req.body[""]) {
    return res.status(400).send({ error: "Please add a hello" });
  } else {
    return res.status(400).send({ error: "Please add a hello" });
  }
});

app.listen(3000, () => {
  console.log("App is listening at port 3000");
});
