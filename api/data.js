module.exports = async function handler(req, res) {
  const url =
    'https://docs.google.com/spreadsheets/d/1u4AE43ko-mIGWMkBIwI9-qoYmJ_sjbBI2BCcr0U5OXM/export?format=csv&gid=0';
  try {
    const upstream = await fetch(url);
    if (!upstream.ok) throw new Error(`sheets ${upstream.status}`);
    const text = await upstream.text();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.status(200).send(text);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};
