/**
 * POST /api/chat — AI legal-assistant enrichment for Pluto Associates.
 *
 * Gracefully layered design:
 *   1. If a search API key is configured (TAVILY_API_KEY or SERPER_API_KEY),
 *      fetch the best live results for the question.
 *   2. If an OpenAI key is configured, synthesize a precise, sourced answer
 *      from those results + the site's own recommended FAQs.
 *   3. If no keys are configured, return { ok:false } and the client uses the
 *      always-available local knowledge-base answer (faqAssistant.js).
 *
 * Env vars (Cloudflare Pages → Settings → Environment variables):
 *   OPENAI_API_KEY    — optional, enables AI synthesis
 *   TAVILY_API_KEY    — optional, enables live web search
 *   SERPER_API_KEY    — optional, alternative web search
 */

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, reason: 'bad-json' }, 400);
    }

    const question = String(body.question || '').trim().slice(0, 400);
    const faqs = Array.isArray(body.faqs) ? body.faqs.slice(0, 4) : [];
    if (!question) return json({ ok: false, reason: 'empty' }, 400);

    const searchKey = env.TAVILY_API_KEY || env.SERPER_API_KEY || null;
    const openaiKey = env.OPENAI_API_KEY || null;

    if (!searchKey && !openaiKey) {
      return json({ ok: false, reason: 'no-keys', question });
    }

    const results = searchKey ? await webSearch(question, searchKey, env.TAVILY_API_KEY ? 'tavily' : 'serper') : [];

    let answer;
    if (openaiKey) {
      answer = await synthesize(question, results, faqs, openaiKey);
    } else {
      answer = {
        text: resultsToText(results, question),
        sources: results.slice(0, 6).map((r) => ({ title: r.title, url: r.url })),
      };
    }

    return json({
      ok: true,
      answer,
      results: results.slice(0, 6).map((r) => ({ title: r.title, url: r.url, content: String(r.content || '').slice(0, 260) })),
      searched: results.slice(0, 6).map((r) => ({ title: r.title, url: r.url })),
      question,
    });
  } catch (err) {
    return json({ ok: false, reason: 'error', message: String(err && err.message || err).slice(0, 300) }, 500);
  }
}

function resultsToText(results, question) {
  if (!results.length) {
    return `I could not find reliable live results for "${question}". Try rephrasing the question, or use the Search the web link below to open a search engine directly.`;
  }
  return `Here are the top live web results for "${question}". Use the links below to open a source.`;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

async function webSearch(question, key, engine) {
  if (engine === 'tavily') {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        query: question,
        search_depth: 'basic',
        max_results: 6,
        include_answer: false,
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r) => ({ title: r.title, url: r.url, content: r.content }));
  }

  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': key },
    body: JSON.stringify({ q: question, num: 5 }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.organic || []).map((r) => ({ title: r.title, url: r.link, content: r.snippet }));
}

async function synthesize(question, results, faqs, openaiKey) {
  const faqCtx = faqs
    .map((f, i) => `${i + 1}. Q: ${f.question}\n   A: ${String(f.answer || '').replace(/<[^>]*>/g, ' ').slice(0, 500)}`)
    .join('\n');
  const webCtx = results.length
    ? results.map((r, i) => `[${i + 1}] ${r.title} : ${r.url}\n${String(r.content || '').slice(0, 700)}`).join('\n\n')
    : '(no live web results available; answer from the firm knowledge base only)';

  const system = [
    'You are the Pluto Associates (plutoassociates.com) legal-assistant chatbot, a Kathmandu, Nepal law firm.',
    'Answer the user precisely using ONLY the provided context (web results + the firm FAQ knowledge base).',
    'Be concise, factual, and practical. Avoid legal advice disclaimers beyond a single short line where relevant.',
    'Always favour the firm\'s own FAQ answers when they cover the question.',
    'When you use a web source, cite it as [n] inline, where [n] is the number of the web result above.',
    'Write in clear, professional prose. Do not use dashes, em dashes, hyphens or hyphenated bullets.',
    'End with the firm\'s practice-area recommendation only if clearly supported by the context.',
  ].join(' ');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 600,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `QUESTION: ${question}\n\nFIRM FAQ KNOWLEDGE BASE:\n${faqCtx || '(none)'}\n\nWEB RESULTS:\n${webCtx}` },
      ],
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error('OpenAI ' + res.status + ' ' + t.slice(0, 200));
  }
  const data = await res.json();
  const text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
  return { text: text.trim(), sources: results.map((r) => ({ title: r.title, url: r.url })) };
}