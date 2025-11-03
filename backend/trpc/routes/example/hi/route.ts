import { publicProcedure } from "../../../create-context";

export default publicProcedure.query(() => {
  return {
    message: "Hello from tRPC!",
    timestamp: new Date().toISOString(),
  };
});