import express from "express";
import compression from "compression";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
const prisma = new PrismaClient();

const app = express();

app.disable("x-powered-by");

app.use(compression());
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors()); // for cross-origin requests


function resource(
  url: string,
  modelName: keyof typeof prisma,
  requiredKeys: string[]
) {
  const model: any = prisma[modelName];
  if (!model) {
    throw new Error(`Cannot find model named ${modelName}`);
  }

  app.get(url, async (req, res) => {
    try {
      const records = await model.findMany();
      res.json(records);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  });

  // all ids have to be converted to integers first
  app.get(url + "/:id", async (req, res) => {
    try {
      const record = await model.findUnique({
        where: { id: parseInt(req.params.id) },
        rejectOnNotFound: true,
      });
      res.json(record);
    } catch (e) {
      console.error(e);
      res.status(404);
    }
  });

  app.post(url, async (req, res) => {
    try {
      requiredKeys.forEach((key) => {
        if (!req.body[key]) {
          console.log(req.body);
          res.status(400).json({ message: `Missing field ${key}` });
          return;
        }
      });

      const record = await model.create({ data: req.body });
      res.json(record);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  });

  app.put(url + "/:id", async (req, res) => {
    try {
      const record = await model.update({
        where: { id: parseInt(req.params.id) },
        data: req.body,
      });
      res.json(record);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  });

  app.delete(url + "/:id", async (req, res) => {
    try {
      await model.delete({
        where: { id: parseInt(req.params.id) },
        rejectOnNotFound: true,
      });
      res.json("ok");
    } catch (e) {
      console.error(e);
      res.status(404);
    }
  });
}

resource("/clinicians", "clinician", [
  "first_name",
  "last_name",
  "national_provider_number",
]);

resource("/patients", "patient", ["first_name", "last_name"]);

resource("/availabilities", "availability", ["start", "clinician_id"]);

resource("/appointments", "appointment", [
  "status",
  "start",
  "clinician_id",
  "patient_id",
  "availability_id",
]);

const port = process.env.BACKEND_PORT || 3001;

app.listen(port, () => {
  console.log(`✅ app ready: http://localhost:${port}`);
});
