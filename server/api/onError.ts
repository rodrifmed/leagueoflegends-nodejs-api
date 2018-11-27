import { Response } from 'express';

export function onError(res: Response, message: string, err: any) {
    console.error(err);

    if(err.statusCode === 404){
        res.status(404).json("not found");
    } if(err.statusCode === 403){ 
        res.status(403).json("forbidden");
    } else {
        res.status(500).json("internal error");
    }
}