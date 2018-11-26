export class SummonerInfo {
    id: number
    name: string
    accountId: number
    profileIconId: number
    revisionDate: number
    summonerLevel: number

    constructor(id: number, name: string, accountId: number, profileIconId: number, revisionDate: number, summonerLevel: number) {
        this.id = id;
        this.name = name
        this.accountId = accountId
        this.profileIconId = profileIconId
        this.revisionDate = revisionDate
        this.summonerLevel = summonerLevel
    }

    static fromJson({ id,
        accountId,
        name,
        profileIconId,
        revisionDate,
        summonerLevel }) {

        return new SummonerInfo(id,
            name,
            accountId,
            profileIconId,
            revisionDate,
            summonerLevel);
    }
}