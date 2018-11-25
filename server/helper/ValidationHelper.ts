export class ValidationHelper {

    static validateSummonerName(name:string){
        const riotRegex = /^[0-9\p{L} ]+$/;
        //console.log("riotRegex",riotRegex);
        //FIXME: regex not working
        //return riotRegex.test(name);
        return true;
    }

}