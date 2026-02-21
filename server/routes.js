import { storage } from "./storage.js";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(httpServer, app) {

  app.get("/api/docs", (req, res) => {
    const docsDir = path.join(process.cwd(), "docs");
    if (!fs.existsSync(docsDir)) {
      return res.status(404).json({ error: "Docs folder not found" });
    }
    const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.docx'));
    res.json(files);
  });

  app.get("/api/docs/download/:filename", (req, res) => {
    const filename = req.params.filename;
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: "Invalid filename" });
    }
    const filePath = path.join(process.cwd(), "docs", filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.sendFile(filePath);
  });

  app.get("/api/docs/page", (req, res) => {
    const docsDir = path.join(process.cwd(), "docs");
    const files = fs.existsSync(docsDir) ? fs.readdirSync(docsDir).filter(f => f.endsWith('.docx')) : [];
    const fileLinks = files.map(f => {
      const label = f.replace('.docx', '').replace(/_/g, ' ');
      return `<li style="margin:12px 0"><a href="/api/docs/download/${encodeURIComponent(f)}" style="color:#2E75B6;font-size:18px;text-decoration:none;border-bottom:1px solid #2E75B6">${label}</a> <span style="color:#888;font-size:14px">(.docx)</span></li>`;
    }).join('');
    res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Documentação</title></head><body style="font-family:Calibri,sans-serif;max-width:600px;margin:60px auto;padding:20px"><h1 style="color:#1F4E79">Documentação do Relation Builder</h1><p style="color:#555">Clique para descarregar:</p><ul style="list-style:none;padding:0">${fileLinks}</ul><p style="margin-top:40px;color:#aaa;font-size:13px">Abra os ficheiros .docx no Word, LibreOffice ou Google Docs.</p></body></html>`);
  });

  app.get("/api/export/templates", (req, res) => {
    try {
      const { name, format } = req.query;
      const templates = [];
      const exportBase = path.join(process.cwd(), "client", "public", "export");
      
      if (name && format) {
        const specificDir = path.join(exportBase, name, format);
        if (fs.existsSync(specificDir)) {
          const files = fs.readdirSync(specificDir).filter(f => !f.startsWith('.'));
          files.forEach(f => templates.push({ name: f, path: `${name}/${format}/${f}`, source: 'specific' }));
        }
      }
      
      if (format) {
        const genericDir = path.join(exportBase, "generic", format);
        if (fs.existsSync(genericDir)) {
          const files = fs.readdirSync(genericDir).filter(f => !f.startsWith('.'));
          files.forEach(f => templates.push({ name: f, path: `generic/${format}/${f}`, source: 'generic' }));
        }
      }
      
      res.json({ templates });
    } catch (error) {
      res.json({ templates: [] });
    }
  });

  app.get("/api/export/template/:templatePath(*)", (req, res) => {
    try {
      const templatePath = req.params.templatePath;
      if (templatePath.includes('..') || path.isAbsolute(templatePath)) {
        return res.status(400).json({ error: "Invalid template path" });
      }
      const exportBase = path.resolve(process.cwd(), "client", "public", "export");
      const filePath = path.resolve(exportBase, templatePath);
      if (!filePath.startsWith(exportBase)) {
        return res.status(400).json({ error: "Invalid template path" });
      }
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Template not found" });
      }
      const content = fs.readFileSync(filePath, "utf8");
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: "Failed to read template" });
    }
  });
  
  // AI Analysis endpoint for Relation Builder
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { question, relation, model } = req.body;
      
      if (!question || !relation) {
        return res.status(400).json({ error: "Question and relation data are required" });
      }
      
      const allowedModels = ['gpt-4.1-mini', 'gpt-4.1-nano', 'gpt-4.1', 'gpt-5.1', 'o3-mini', 'o4-mini'];
      const selectedModel = allowedModels.includes(model) ? model : 'gpt-4.1-mini';
      
      // Prepare data summary for context
      const columns = Object.keys(relation.columns || {});
      const types = relation.columns || {};
      const rowCount = relation.items?.length || 0;
      
      // Sample data (first 50 rows max for context)
      const sampleRows = (relation.items || []).slice(0, 50);
      const dataSample = sampleRows.map((row, idx) => {
        const obj = {};
        columns.forEach((col, i) => {
          const value = row[i];
          if (types[col] === 'relation') {
            obj[col] = `[Nested relation with ${value?.items?.length || 0} rows]`;
          } else {
            obj[col] = value;
          }
        });
        return obj;
      });
      
      const systemPrompt = `You are a data analyst assistant. You analyze relational data tables and answer questions about the data.

The user has a relation (table) with the following structure:
- Columns: ${JSON.stringify(types)}
- Total rows: ${rowCount}
- Sample data (first ${dataSample.length} rows): ${JSON.stringify(dataSample, null, 2)}

Based on this data, answer the user's question. If the question asks to filter data, respond with a JSON object in this format:
{
  "type": "filter",
  "description": "Description of the filter",
  "conditions": [{"column": "columnName", "operator": "equals|contains|gt|lt|gte|lte|isNull|isNotNull", "value": "..."}]
}

If the question is asking for analysis or information, respond with:
{
  "type": "answer",
  "text": "Your analysis or answer here in HTML format. Use <p>, <ul>, <li>, <strong>, <em>, <table>, <tr>, <th>, <td> tags for formatting."
}

Always respond with valid JSON. For the "text" field, use HTML formatting to make the response readable.`;

      const isReasoningModel = selectedModel.startsWith('o3') || selectedModel.startsWith('o4');
      const requestParams = {
        model: selectedModel,
        messages: isReasoningModel
          ? [{ role: "user", content: systemPrompt + "\n\nUser question: " + question }]
          : [
              { role: "system", content: systemPrompt },
              { role: "user", content: question }
            ],
        max_completion_tokens: 2048,
      };
      if (!isReasoningModel) {
        requestParams.response_format = { type: "json_object" };
      }
      const response = await openai.chat.completions.create(requestParams);
      
      let content = response.choices[0]?.message?.content || '{"type": "answer", "text": "Unable to analyze data."}';
      // Strip markdown code fences if present (reasoning models may wrap JSON)
      content = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
      const result = JSON.parse(content);
      
      res.json(result);
    } catch (error) {
      console.error("AI Analysis error:", error);
      res.status(500).json({ error: "Failed to analyze data" });
    }
  });
  
  return httpServer;
}
