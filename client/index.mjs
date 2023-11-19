import { request } from "http";
import { createGzip } from "zlib";
import { createReadStream } from "fs";
import { basename } from "path";

const filename = process.argv[2];

const httpRequestOptions = {
  hostname: "localhost",
  port: 3000,
  path: "/",
  method: "PUT",
  headers: {
    "Content-Type": "application/octet-stream",
    "Content-Encoding": "gzip",
    "X-Filename": basename(filename),
  },
};
const req = request(httpRequestOptions, (res) => {
  console.log(`Server response: ${res.statusCode}`);
});
createReadStream(filename)
  .pipe(createGzip())
  .pipe(req)
  .on("finish", () => {
    console.log("File successfully sent");
  });
