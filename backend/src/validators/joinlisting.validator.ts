/**
 * @author aliasgarbootwala3@gmial.com
 */

import Joi from "joi";

const cuid = Joi.string().pattern(/^c[a-z0-9]{24}$/);

export const joinGameListingParamsSchema = Joi.object({
  listingId: cuid.required(),
});

export const joinTournamentParamsSchema = Joi.object({
  tournamentId: cuid.required(),
});

export const joinListingIdParamsSchema = Joi.object({
  joinId: cuid.required(),
});

export const leaveJoinSchema = Joi.object({
  exitReason: Joi.string().trim().allow(null, "").max(500),
});
