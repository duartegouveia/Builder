import { storage } from "./storage.js";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const openrouter = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL,
});

const OPENAI_MODELS = [
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', company: 'OpenAI', provider: 'openai' },
  { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', company: 'OpenAI', provider: 'openai' },
  { id: 'gpt-4.1', name: 'GPT-4.1', company: 'OpenAI', provider: 'openai' },
  { id: 'o3-mini', name: 'o3-mini', company: 'OpenAI', provider: 'openai' },
  { id: 'o4-mini', name: 'o4-mini', company: 'OpenAI', provider: 'openai' },
];

const OPENROUTER_CURATED_MODELS = [
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', company: 'Anthropic', provider: 'openrouter' },
  { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', company: 'Anthropic', provider: 'openrouter' },
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', company: 'Google', provider: 'openrouter' },
  { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', company: 'Google', provider: 'openrouter' },
  { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', company: 'Meta', provider: 'openrouter' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', company: 'Meta', provider: 'openrouter' },
  { id: 'deepseek/deepseek-chat-v3-0324', name: 'DeepSeek V3', company: 'DeepSeek', provider: 'openrouter' },
  { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', company: 'DeepSeek', provider: 'openrouter' },
  { id: 'mistralai/mistral-medium-3', name: 'Mistral Medium 3', company: 'Mistral', provider: 'openrouter' },
  { id: 'mistralai/mistral-small-3.1-24b-instruct', name: 'Mistral Small 3.1', company: 'Mistral', provider: 'openrouter' },
  { id: 'qwen/qwen3-235b-a22b', name: 'Qwen3 235B', company: 'Qwen', provider: 'openrouter' },
  { id: 'x-ai/grok-3-mini', name: 'Grok 3 Mini', company: 'xAI', provider: 'openrouter' },
];

let cachedModels = null;
let cacheTimestamp = 0;
const CACHE_TTL = 3600000;

function getAvailableModels() {
  const now = Date.now();
  if (cachedModels && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedModels;
  }

  const models = [];

  if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    models.push(...OPENAI_MODELS);
  }

  if (process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY) {
    models.push(...OPENROUTER_CURATED_MODELS);
  }

  cachedModels = models;
  cacheTimestamp = now;
  return models;
}

function getClientForModel(modelId) {
  const models = getAvailableModels();
  const model = models.find(m => m.id === modelId);
  if (!model) {
    return { client: openai, provider: 'openai' };
  }
  if (model.provider === 'openrouter') {
    return { client: openrouter, provider: 'openrouter' };
  }
  return { client: openai, provider: 'openai' };
}

function isReasoningModel(modelId) {
  return modelId.startsWith('o3') || modelId.startsWith('o4') ||
         modelId.includes('deepseek-r1');
}

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

  app.get("/api/ai/models", (req, res) => {
    try {
      const models = getAvailableModels();
      const grouped = {};
      for (const m of models) {
        if (!grouped[m.company]) grouped[m.company] = [];
        grouped[m.company].push({ id: m.id, name: m.name, company: m.company, provider: m.provider });
      }
      res.json({ models, grouped });
    } catch (error) {
      console.error("Models list error:", error);
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });
  
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { question, relation, model } = req.body;
      
      if (!question || !relation) {
        return res.status(400).json({ error: "Question and relation data are required" });
      }
      
      const availableModels = getAvailableModels();
      const modelIds = availableModels.map(m => m.id);
      const selectedModel = modelIds.includes(model) ? model : 'gpt-4.1-mini';
      const { client } = getClientForModel(selectedModel);
      
      const columns = Object.keys(relation.columns || {});
      const types = relation.columns || {};
      const rowCount = relation.items?.length || 0;
      
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

      const reasoning = isReasoningModel(selectedModel);
      const requestParams = {
        model: selectedModel,
        messages: reasoning
          ? [{ role: "user", content: systemPrompt + "\n\nUser question: " + question }]
          : [
              { role: "system", content: systemPrompt },
              { role: "user", content: question }
            ],
      };
      if (reasoning) {
        requestParams.max_completion_tokens = 2048;
      } else {
        requestParams.max_tokens = 2048;
        requestParams.response_format = { type: "json_object" };
      }
      const response = await client.chat.completions.create(requestParams);
      
      let content = response.choices[0]?.message?.content || '{"type": "answer", "text": "Unable to analyze data."}';
      content = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
      const result = JSON.parse(content);
      
      res.json(result);
    } catch (error) {
      console.error("AI Analysis error:", error);
      res.status(500).json({ error: "Failed to analyze data: " + (error.message || '') });
    }
  });
  
  app.post("/api/ai/compare-models", async (req, res) => {
    try {
      const { models, language, useModel } = req.body;

      if (!models || !Array.isArray(models) || models.length === 0) {
        return res.status(400).json({ error: "Models list is required" });
      }

      const lang = language || 'en';
      const availableModels = getAvailableModels();
      const modelIds = availableModels.map(m => m.id);
      const selectedModel = (useModel && modelIds.includes(useModel)) ? useModel : 'gpt-4.1-mini';
      const { client } = getClientForModel(selectedModel);

      const modelsList = models.map(m => `- ${m.name} (${m.company})`).join('\n');

      const langMap = { pt: 'Portuguese', en: 'English', es: 'Spanish', fr: 'French', it: 'Italian', de: 'German' };
      const langName = langMap[lang] || 'English';

      const systemPrompt = `You are an AI technology expert. Respond ENTIRELY in ${langName}. Generate an HTML comparison of the following AI models. For each model, provide:
1. Approximate release date
2. Key strengths compared to competitors
3. Key weaknesses compared to competitors
4. Cost level (Low / Medium / High / Very High) relative to competitors

Models to compare:
${modelsList}

Respond with ONLY valid JSON in this format:
{
  "html": "<div>...your HTML comparison content here...</div>"
}

Use a well-structured HTML table with <table>, <thead>, <tbody>, <tr>, <th>, <td> tags. Use <strong> for emphasis. Keep descriptions concise (1-2 sentences each). The table should have columns: Model, Company, Release Date, Strengths, Weaknesses, Cost Level. Do NOT include any markdown, only HTML inside the JSON.`;

      const reasoning = isReasoningModel(selectedModel);
      const requestParams = {
        model: selectedModel,
        messages: reasoning
          ? [{ role: "user", content: systemPrompt }]
          : [
              { role: "system", content: systemPrompt },
              { role: "user", content: "Compare these AI models." }
            ],
      };
      if (reasoning) {
        requestParams.max_completion_tokens = 4096;
      } else {
        requestParams.max_tokens = 4096;
        requestParams.response_format = { type: "json_object" };
      }

      const response = await client.chat.completions.create(requestParams);
      let content = response.choices[0]?.message?.content || '{"html": ""}';
      content = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
      const result = JSON.parse(content);

      res.json({ html: result.html || '' });
    } catch (error) {
      console.error("AI Model Comparison error:", error);
      res.status(500).json({ error: "Failed to compare models: " + (error.message || '') });
    }
  });

  return httpServer;
}
