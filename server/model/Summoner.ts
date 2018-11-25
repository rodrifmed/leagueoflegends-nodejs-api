export class Summoner {
    id: number
    name: string
    accountId: number
    profileIconId: number
    revisionDate: number
    summonerLevel: number
    matches: any[]

    constructor(id: number, name: string, accountId: number, profileIconId: number, revisionDate: number, summonerLevel: number) {
        this.id = id
        this.name = name
        this.accountId = accountId
        this.profileIconId = profileIconId
        this.revisionDate = revisionDate
        this.summonerLevel = summonerLevel
    }

    static fromJson({ id,
        name,
        accountId,
        profileIconId,
        revisionDate,
        summonerLevel }) {
        return new Summoner(id,
            name,
            accountId,
            profileIconId,
            revisionDate,
            summonerLevel)
    }
}