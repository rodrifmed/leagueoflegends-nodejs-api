
import { Application } from "express";
import { apiGetMatches } from "./apiGetMatches";
import { onSuccess } from "../../examples/node-firebase-rest-api-example/server/api/onSuccess";

export function initRestApi(app: Application) {
    app.route('/').get((req, res) => onSuccess(res, 'Hello World'));
    app.route('/api/matches/:name').get(apiGetMatches);
}