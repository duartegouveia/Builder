import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use("*", (req, res) => {
    const url = req.originalUrl;
    
    if (url === "/logic.html" || url.startsWith("/logic.html?")) {
      const logicPath = path.resolve(distPath, "logic.html");
      if (fs.existsSync(logicPath)) {
        return res.sendFile(logicPath);
      }
    }
    
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
