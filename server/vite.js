import { createServer as createViteServer, createLogger } from "vite";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export async function setupVite(server, app) {
  const viteConfig = await import("../vite.config.js").then(m => m.default);
  
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let htmlFile = "relation.html";
      if (url === "/logic.html" || url.startsWith("/logic.html?")) {
        htmlFile = "logic.html";
      } else if (url === "/logic-builder.html" || url.startsWith("/logic-builder.html?")) {
        htmlFile = "index.html";
      } else if (url === "/keyboard.html" || url.startsWith("/keyboard.html?")) {
        htmlFile = "keyboard.html";
      }
      
      const clientTemplate = path.resolve(__dirname, "..", "client", htmlFile);

      if (!fs.existsSync(clientTemplate)) {
        return next();
      }

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
