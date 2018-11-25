export interface IRiotLibWrapper {

    riotApiKey:string;
    initApi();
    getMatchesStatsByName(name:string) : any;

}