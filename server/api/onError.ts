import { Response } from 'express';

export function onError(res: Response, message: string, err: any) {
    console.error(err);
    res.status(500).send();
}