import { createServer } from "http";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { createGunzip } from "zlib";
import { basename, join } from "path";

const DEST_FOLDER = "received_files";

const server = createServer((req, res) => {
  !existsSync(DEST_FOLDER) ? mkdirSync(DEST_FOLDER) : undefined;

  const filename = basename(req.headers["x-filename"]);
  const destFilename = join(DEST_FOLDER, filename);
  console.log(`File request received: ${filename}`);
  req
    .pipe(createGunzip())
    .pipe(createWriteStream(destFilename))
    .on("finish", () => {
      res.writeHead(201, { "Content-Type": "text/plain" });
      res.end("OK\n");
      console.log(`File saved: ${destFilename}`);
    });
});
server.listen(3000, () => console.log("Listening on http:// localhost:3000"));
