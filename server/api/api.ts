
import { Application } from "express";
import { apiGetMatches } from "./apiGetMatches";

export function initRestApi(app: Application) {
    app.route('/api/matches/:name').get(apiGetMatches);
}