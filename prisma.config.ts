import "dotenv/config";
import { definePrismaConfig} from "prisma/config";

export default definePrismaConfig({
  datasource: {
    url: process.env.DIRECT_URL,
  },
});