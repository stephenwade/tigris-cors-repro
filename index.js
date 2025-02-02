// @ts-check

import http from "node:http";
import fs from "node:fs/promises";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Fill in your Tigris credentials here
const TIGRIS_ACCESS_KEY_ID = "";
const TIGRIS_SECRET_ACCESS_KEY = "";
const TIGRIS_BUCKET_NAME = "";

async function makeSignedUrl() {
  const S3 = new S3Client({
    region: "auto",
    endpoint: "https://fly.storage.tigris.dev",
    credentials: {
      accessKeyId: TIGRIS_ACCESS_KEY_ID,
      secretAccessKey: TIGRIS_SECRET_ACCESS_KEY,
    },
  });

  const command = new PutObjectCommand({
    Bucket: TIGRIS_BUCKET_NAME,
    Key: `demo-${Date.now()}.json`,
    ContentType: "application/json",
  });

  return await getSignedUrl(S3, command);
}

const server = http.createServer(async (req, res) => {
  const url = req.url;

  try {
    if (url === "/") {
      const data = await fs.readFile("index.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    } else if (url === "/new") {
      const responseObject = { url: await makeSignedUrl() };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(responseObject));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.write("Internal Server Error\n");
    res.end(error.message);
  }
});

server.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});
