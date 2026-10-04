export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const target = req.method === 'GET' ? req.query.url : req.body?.url;
  if (!target) return res.status(400).json({ error: 'Missing url' });

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': '*/*'
    };

    const fetchOptions = { method: req.method, headers };

    if (req.method === 'POST' && req.body && req.body.body) {
      headers['Content-Type'] = req.body.contentType || 'application/json';
      fetchOptions.body = typeof req.body.body === 'string'
        ? req.body.body
        : JSON.stringify(req.body.body);
    }

    const resp = await fetch(target, fetchOptions);
    const buffer = await resp.arrayBuffer();

    res.setHeader('Content-Type', resp.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(resp.status).send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
