import { web } from "./app/web.js";
import { logger } from "./app/logging.js";

const port = 300;

web.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
