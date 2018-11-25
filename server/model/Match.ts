import { GameDetail } from "./GameDetail";

export class Match {

    platformId: string
    gameId: number
    champion: number
    queue: number
    season: number
    timestamp: number
    role: string
    lane: string
    gameDetail: GameDetail
    summonerParticipant: any


}