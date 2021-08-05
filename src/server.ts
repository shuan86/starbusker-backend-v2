import { app } from "./app";
const PORT = 8081;

let server = app.listen(PORT, () => {
  console.log('Express server listening on Port ', PORT);
})

export default server