import { Response } from 'express';

export function onSuccess(res: Response, data: any) {
    console.log(data);
    res.status(200).json({ payload: data });

}