

import { Injectable } from '@nestjs/common';
import  * as find from 'lodash.find';
import * as findIndex from 'lodash.findindex';
var crypto = require('crypto');

@Injectable()
export class HashService {


hashList = [];

clientSaw = [];

    public hashExist(url, factor){ 

        console.log(this.hashList);
        console.log(this.encode(factor))
       return !!find(this.hashList, { url, hash: this.encode(factor) });
    }
    
    public setUrlHash(url, factor){

      const index = findIndex(this.hashList, { url });

        if(index > -1){
          this.hashList.splice(index,1);
        }

        

       
        
        this.hashList.push({
            url,
            hash:  this.encode(factor)
       });
    }


    public setClientSaw(clientCode, factor){
        // const hash =  this.encode(factor);

        const hash = this.encode(factor);

        const index = findIndex(this.clientSaw, { hash })

        if(findIndex(this.clientSaw, { hash }) === -1){
            this.clientSaw.push({
                hash,
                clients: [clientCode]
            });
        }

        if(this.clientSaw[index].clients.indexOf(clientCode) === -1 ){
            this.clientSaw[index].clients.push(clientCode);
        }

        
        
    }

    public setClientSawHash(clientCode, factor){
        // const hash =  this.encode(factor);
    }


    private encode(factor){
      return crypto
        .createHash('sha256')
        .update(factor.toString())
        .digest('base64');
    }

}
