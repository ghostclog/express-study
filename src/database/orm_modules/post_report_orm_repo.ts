import { AppDataSource } from "../setting/config";
import { PostReport } from "../setting/tables/PostReport";

export const PostReportOrmRepo = AppDataSource.getRepository(PostReport).extend({});
