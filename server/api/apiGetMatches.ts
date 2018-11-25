import { Request, Response } from 'express';
import { onError } from "./onError";
import { onSuccess } from "./onSuccess";
import * as _ from 'lodash';
import { ValidationHelper } from '../helper/ValidationHelper';
import container from "../config/inversify-config";
import { IRiotLibWrapper } from '../wrapper/IRiotLibWrapper';
import INVERSIFY_TYPES from '../config/inversify-types';

export async function apiGetMatches(req: Request, res: Response) {

    try {
        const matches = await getMatchesStats(req.params);
        return onSuccess(res, matches);
    } catch (ex) {
        onError(res, "Not Found", ex);
    }
}

async function getMatchesStats(params: any) {

    var apiWrapper = container.get<IRiotLibWrapper>(INVERSIFY_TYPES.IRiotLibWrapper);

    let summonerName = params.name;

    let apiValidName = ValidationHelper.validateSummonerName(summonerName);

    if (apiValidName === false) {
        throw Error("Invalid Name");
    }

    return apiWrapper.getMatchesStatsByName(summonerName);
}
