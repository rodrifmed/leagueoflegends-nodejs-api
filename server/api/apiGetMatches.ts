import { Request, Response } from 'express';
import { onError } from "./onError";
import { onSuccess } from "./onSuccess";
import * as _ from 'lodash';
import { kayn } from './kayn';
import { MatchV3MatchReferenceDto } from 'kayn/typings/dtos';
import { Summoner } from '../model/Summoner';
import { Match } from '../model/Match';

export async function apiGetMatches(req: Request, res: Response) {

    try {
        const matches = await getMatchesStats(req.params);
        return onSuccess(res, matches);
    } catch (ex) {
        onError(res, "Not Found", ex);
    }
}

async function getMatchesStats(params: any) {
    let summonerName = params.name;

    const summoner: Summoner = await kayn.Summoner.by.name(summonerName)

    const accountId: number = summoner.accountId!; // Not-nullable assertion.
    const matchlist = await kayn.Matchlist.by.accountID(accountId).query({
        beginIndex: 0,
        endIndex: 1
    });

    const matches = matchlist.matches as Match[];

    await setGames(matches);

    setParticipant(matches, accountId);

    summoner.matches = matches;

    return summoner;
}

async function setGames(matches: Match[]) {

    const matchesWithGamesPromise = matches.map(async match => {
        const gameMatch = await kayn.Match.get(match.gameId);
        match.gameDetail = gameMatch;
        return match;
    })

    await Promise.all(matchesWithGamesPromise);

}

function setParticipant(matches: Match[], accountId: any) {

    matches.map(match => {

        const participantIdentities = match.gameDetail.participantIdentities;

        participantIdentities.forEach(participantIdentity => {
            if (accountId === participantIdentity.player.accountId) {
                const participantId = participantIdentity.participantId;
                const participants = match.gameDetail.participants;

                participants.forEach(participant => {
                    if (participantId === participant.participantId) {
                        match.summonerParticipant = participant
                    }
                })
            }
        });

        return match;
    })

}