import { invitationSchema } from "../domain/schemas";
import { Invitation } from "../domain/types";
import { BaseService } from "./base.service";

export class InvitationService extends BaseService<Invitation> {
  get tableName(): string {
    return 'invitations';
  }

  get schema() {
    return invitationSchema;
  }

  public async answerInvitation(dbKey: string, invitationId: string, gamblerId: string, accept: boolean): Promise<Invitation | null> {
    const db = this.getDB(dbKey);
    const result = await db.update(this.tableName, {
      id: invitationId,
      invitedGambler: gamblerId,
      revokedAt: null,
    }, {
      [accept ? 'acceptedAt' : 'revokedAt']: new Date(),
    });
    if (result > 0) {
      const [invitation] = await db.find(this.tableName, { id: invitationId, invitedGambler: gamblerId });
      return invitation ? this.fromRow(invitation) : null;
    }
    return null;
  }
}