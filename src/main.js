import { web } from "./app/web.js";
import { logger } from "./app/logging.js";

const port = 3000;

web.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
