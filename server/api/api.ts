
import { Application } from "express";
import { apiGetMatches } from "./apiGetMatches";
import { onSuccess } from "../../examples/node-firebase-rest-api-example/server/api/onSuccess";
import container from "../config/inversify-config";
import { IRiotLibWrapper } from "../wrapper/IRiotLibWrapper";
import INVERSIFY_TYPES from "../config/inversify-types";

export function initRestApi(app: Application) {

    var apiWrapper = container.get<IRiotLibWrapper>(INVERSIFY_TYPES.IRiotLibWrapper);
    apiWrapper.initApi();

    app.route('/').get((req, res) => onSuccess(res, 'Hello World'));
    app.route('/api/matches/:name').get(apiGetMatches);
}