const { Kayn, METHOD_NAMES, REGIONS, RedisCache } = require('kayn')
import { injectable } from "inversify"
import { IRiotLibWrapper } from "./IRiotLibWrapper";
import { KaynConfig } from 'kayn';
import { ValidationHelper } from "../helper/ValidationHelper";
import { Summoner } from "../model/Summoner";
import { Match } from "../model/Match";

const redisCache = new RedisCache({
    host: 'localhost',
    port: 6379,
    keyPrefix: 'kayn',
    password: 'hello-world'
})

const kaynConfig: KaynConfig = {
    region: REGIONS.BRAZIL,
    debugOptions: {
        isEnabled: true,
        showKey: false,
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 3000,
    },
    cacheOptions: {
        cache: redisCache,
        timeToLives: {
            useDefault: true,
            byGroup: {
                DDRAGON: 1000 * 60 * 60 * 24 * 30, // cache for a month
            },
            byMethod: {
                [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME]: 50000, // ms
            },
        },
    },
}

@injectable()
export class KaynLib implements IRiotLibWrapper {

    riotApiKey: string = 'RGAPI-4bb19c2c-207d-4b54-9a34-1eb5e2a395dd';

    kayn: any;

    constructor() {
    }

    initApi() {
        this.kayn = Kayn(this.riotApiKey)(kaynConfig)
    }

    async getMatchesStatsByName(name: string) {
        
        let apiValidName = ValidationHelper.validateSummonerName(name);

        if (apiValidName === false) {
            throw Error("Invalid Name");
        }

        const summoner: Summoner = await this.kayn.Summoner.by.name(name)

        const accountId: number = summoner.accountId!;
        const matchlist = await this.kayn.Matchlist.by.accountID(accountId).query({
            beginIndex: 0,
            endIndex: 1
        });

        const matches = matchlist.matches as Match[];

        await this.setGames(matches);

        this.setParticipant(matches, accountId);

        summoner.matches = matches;

        return summoner;
    }

    async setGames(matches: Match[]) {

        const matchesWithGamesPromise = matches.map(async match => {
            const gameMatch = await this.kayn.Match.get(match.gameId);
            match.gameDetail = gameMatch;
            return match;
        })

        await Promise.all(matchesWithGamesPromise);

    }

    setParticipant(matches: Match[], accountId: any) {

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

}