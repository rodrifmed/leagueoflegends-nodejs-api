import { SummonerRune } from "./SummonerRune";

export class Match {

    accountId:number;
    gameId:number
    outcome: string // get team from participants[] -> teams[X].win = "Win/Fail"
    championName: string // matches[].champion
    gameDuration: string // matches[].gameDetail.gameDuration
    kda: string // matches[].gameDetail.participants[x].stats.kills/deaths/assists
    summonerName: string // name
    summonerSpells: number[] // matches[].gameDetail.participants[x].spell1Id/spell2Id
    summonerRunes: SummonerRune[] // matches[].gameDetail.participants[x].stats.perk'X'/perk'X'Var'Y'
    items: string[] // matches[].gameDetail.participants[x].stats.item0-6
    championLevel: 13 // matches[].gameDetail.participants[x].stats.champLevel 

}