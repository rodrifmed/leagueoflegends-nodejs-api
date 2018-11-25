import { Response } from 'express';

export function onError(res: Response, message: string, err: any) {
    res.status(500).send();
}