import app from "@/app";
import "dotenv/config";

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
