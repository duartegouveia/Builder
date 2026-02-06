import { storage } from "./storage.js";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(httpServer, app) {

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
      const { question, relation } = req.body;
      
      if (!question || !relation) {
        return res.status(400).json({ error: "Question and relation data are required" });
      }
      
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

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        max_completion_tokens: 2048,
        response_format: { type: "json_object" }
      });
      
      const content = response.choices[0]?.message?.content || '{"type": "answer", "text": "Unable to analyze data."}';
      const result = JSON.parse(content);
      
      res.json(result);
    } catch (error) {
      console.error("AI Analysis error:", error);
      res.status(500).json({ error: "Failed to analyze data" });
    }
  });
  
  return httpServer;
}
