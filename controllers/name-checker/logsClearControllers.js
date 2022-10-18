import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fsPromises = fs.promises;

export const logsClearController = async (req, res) => {
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    } else {
      await fsPromises.writeFile(
        path.join(__dirname, "..", "logs", "requestsLog.txt"),
        ""
      );
      res.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
