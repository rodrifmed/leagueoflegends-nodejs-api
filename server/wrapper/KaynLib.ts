const { Kayn, METHOD_NAMES, REGIONS, RedisCache } = require('kayn')
import { injectable } from "inversify"
import { IRiotLibWrapper } from "./IRiotLibWrapper";
import { KaynConfig } from 'kayn';
import { ValidationHelper } from "../helper/ValidationHelper";
import { SummonerInfo } from "../model/SummonerInfo";
import { Match } from "../model/Match";
import { MatchV3MatchReferenceDto } from "kayn/typings/dtos";
import { SummonerRune } from "../model/SummonerRune";
import lodash = require("lodash");

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
    }
}

@injectable()
export class KaynLib implements IRiotLibWrapper {

    riotApiKey: string = process.env.RIOT_API_KEY
    useCache: string = process.env.USE_CACHE

    kayn: any;

    constructor() {
    }

    initApi() {

        if(this.useCache === 'true'){

            const redisCache = new RedisCache({
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                keyPrefix: 'kayn'
            })

            kaynConfig.cacheOptions = {
                cache: redisCache,
                timeToLives: {
                    useDefault: true,
                    byGroup: {
                        DDRAGON: 1000 * 60 * 60 * 24 * 30, // cache for a month
                    },
                    byMethod: {
                        [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME]: 1800000, // ms // 30min
                        [METHOD_NAMES.MATCH.GET_MATCHLIST]: 1800000, // ms // 30min
                        [METHOD_NAMES.MATCH.GET_MATCH]: 1800000, // ms // 30min
                    },
                },
            }
        }

        this.kayn = Kayn(this.riotApiKey)(kaynConfig)
    }

    async getMatchesStatsByName(name: string) {

        let apiValidName = ValidationHelper.validateSummonerName(name);

        if (apiValidName === false) {
            throw Error("Invalid Name");
        }

        let summonerInfo: SummonerInfo;
        let matches: Match[] = [];

        const summoner: any = await this.kayn.Summoner.by.name(name)

        summonerInfo = SummonerInfo.fromJson(summoner);

        const matchlist = await this.kayn.Matchlist.by.accountID(summonerInfo.accountId).query({
            beginIndex: 0,
            endIndex: 5
        });

        const matchesV3 = matchlist.matches as MatchV3MatchReferenceDto[];


        matchesV3.forEach(matchV3 => {
            let match = new Match();
            match.gameId = matchV3.gameId;
            match.accountId = summonerInfo.accountId;
            match.summonerName = name;
            match.championName = matchV3.champion.toString();
            matches.push(match);
        });

        await this.setGames(matches);

        let result: any = {};

        result.summonerInfo = summonerInfo;
        result.matches = matches;

        return result;
    }

    async setGames(matches: Match[]) {

        const matchesWithGamesPromise = matches.map(async match => {
            const gameMatch = await this.kayn.Match.get(match.gameId);

            match.gameDuration = gameMatch.gameDuration;

            const participantId = this.findParticipantId(gameMatch, match.accountId);
            const participantObject = this.getParcipantObject(gameMatch, participantId);
            const statsObject = participantObject.stats;
            const teamId = participantObject.teamId;

            match.outcome = this.getOutcome(gameMatch, teamId);
            match.kda = statsObject.kills + "-" + statsObject.deaths + "-" + statsObject.assists;
            match.summonerSpells = lodash.concat(participantObject.spell1Id, participantObject.spell2Id);
            match.summonerRunes = this.getRunes(statsObject);
            match.items = this.getItems(statsObject);
            match.championLevel = statsObject.champLevel;

            return match;
        })

        await Promise.all(matchesWithGamesPromise);

    }

    getItems(statsObject: any): number[] {
        let items: number[] = [];

        for (let i = 0; i < 7; i++) {
            items.push(statsObject[`item${i}`]);
        }

        return items;
    }

    getRunes(statsObject: any): SummonerRune[] {

        let summonerRunes: SummonerRune[] = [];

        for (let i = 0; i < 6; i++) {

            let summonerRune = new SummonerRune();

            summonerRune.perk = statsObject[`perk${i}`];
            let perkVar: number[] = [];
            for (let j = 1; j < 4; j++) {
                perkVar.push(statsObject[`perk${i}Var${j}`])
            }

            summonerRune.perkVar = perkVar;

            summonerRunes.push(summonerRune);

        }

        return summonerRunes;

    }

    getOutcome(gameMatch: any, teamId: number): string {
        let outcome: string;

        const teams = gameMatch.teams;

        teams.forEach(team => {
            if (teamId === team.teamId) {
                outcome = team.win;
            }
        });

        return outcome;
    }

    getParcipantObject(gameMatch: any, participantId: number): any {
        let participantObject: any;

        const participants = gameMatch.participants;

        participants.forEach(participant => {
            if (participantId === participant.participantId) {
                participantObject = participant
            }
        })

        return participantObject;
    }

    findParticipantId(gameMatch: any, accountId: any): number {
        let participantId: number;

        const participantIdentities = gameMatch.participantIdentities;

        participantIdentities.forEach(participantIdentity => {
            if (accountId === participantIdentity.player.accountId) {
                participantId = participantIdentity.participantId;
            }
        });

        return participantId;
    }

}