import { SummonerRune } from "./SummonerRune";

export class Match {

    accountId: number;
    gameId: number
    outcome: string
    championName: string
    gameDuration: string
    kda: string
    summonerName: string
    summonerSpells: string[]
    summonerRunes: string[]
    items: string[]
    championLevel: number
    championImgProfile:string

}