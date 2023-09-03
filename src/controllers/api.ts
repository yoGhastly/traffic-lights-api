import { Application, Request, Response } from "express";

import path from "path";
import fs from "fs";

export const loadApiEndpoints = (app: Application): void => {
  app.get("/", (_req, res) => {
    res.status(200).send("Hello world!");
  });

  app.post("/api", (req, res) => {
    const filePath = path.join(__dirname, "../../data/report.txt");

    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        res.status(500).send("Error reading file");
      } else {
        res.set("Content-Type", "text/plain");
        res.send(data);
      }
    });
  });
};
