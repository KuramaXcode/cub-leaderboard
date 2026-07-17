module.exports = async function handler(req, res) {
  const url =
    'https://docs.google.com/spreadsheets/d/1tShXIZzrC4RkfdtgOyb0-Lg7mrhtdRvmW-2L35huUw4/export?format=csv&gid=921237688';
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
