import { Injectable } from '@nestjs/common';
import * as findIndex from 'lodash.findindex';

@Injectable()
export class LockerService {


    private urls = [];

    public setUrlInProcess(url){
        const index = findIndex(this.urls, { url })
        if(index > -1){
            this.urls.splice(index,1);
        }
        this.urls.push({
            url,
            process: true
        })
    }

    public isInProcess(url){
        console.log(findIndex);
        const index = findIndex(this.urls, { url })

        if(index === -1 ){
            return false;
        }

        return this.urls[index].process;
    }

    public setUrlProcessFinished(url){
        const index = findIndex(this.urls, { url });
        this.urls[index].process = false; 
    }
}


