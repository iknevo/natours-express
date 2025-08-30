import app from "@/app";
import config from "@/config/config";
import "dotenv/config";

const { port } = config;
app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
