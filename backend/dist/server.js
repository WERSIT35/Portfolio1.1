import { createApp } from "./app.js";
import { config } from "./config.js";
import { ensureDb } from "./store/db.js";
const start = async () => {
    await ensureDb();
    const app = createApp();
    app.listen(config.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Admin backend running on http://localhost:${config.port}`);
    });
};
start().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start backend", error);
    process.exit(1);
});
