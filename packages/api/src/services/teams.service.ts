import { teamSchema } from "../domain/schemas";
import { Team } from "../domain/types";
import { BaseService } from "./base.service";

export class TeamService extends BaseService<Team> {
  get tableName(): string {
    return 'teams';
  }

  get schema() {
    return teamSchema;
  }
}