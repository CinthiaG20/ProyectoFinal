import { matchSchema } from "../domain/schemas";
import { Match } from "../domain/types";
import { BaseService } from "./base.service";

export class MatchService extends BaseService<Match> {
  get tableName(): string {
    return 'matches';
  }

  get schema() {
    return matchSchema;
  }
}
