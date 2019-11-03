import app from './app';
const PORT = 9999;
const HOST = '127.0.0.1';

try {
  app.listen(PORT, HOST, () =>
    console.log(`Server running at http://${HOST}:${PORT}/`)
  );
} catch (e) {
  console.log(e);
}
