import app from './app';
import { HOST, PORT } from './dotenv.config';

try {
  app.listen(PORT, HOST, () =>
    console.log(`Server running at http://${HOST}:${PORT}/`)
  );
} catch (e) {
  console.log(e);
}
