import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { firstValueFrom } from 'rxjs';
import { HtmlToJsonService } from './html-to-json/html-to-json.service';
import { ProxyRequestService } from './proxy-request/proxy-request.service';
var crypto = require('crypto');
import { Response } from 'express';
import { HashService } from './hash/hash.service';
import { LockerService } from './locker/locker.service';

@Injectable()
export class AppService {
  constructor(
    private http: HttpService,
    private htmlToJson: HtmlToJsonService,
    private proxyRequest: ProxyRequestService,
    private hash: HashService,
    private locker: LockerService,
  ) {}

  async getRefreshedPage(
    url: string,
    res: Response,
    isfirstTime: boolean,
    clientCode: boolean
  ): Promise<any> {
    const randomQuery = Date.now();
    // const response = await firstValueFrom(
    //   this.http.get(
    //     `https://sfbay.craigslist.org/search/cta?auto_title_status=1&nearbyArea=102&nearbyArea=12&dd=ss&nearbyArea=187&nearbyArea=188&nearbyArea=189&nearbyArea=191&nearbyArea=208&nearbyArea=285&nearbyArea=346&nearbyArea=373&nearbyArea=43&nearbyArea=454&nearbyArea=456&nearbyArea=62&nearbyArea=63&nearbyArea=708&nearbyArea=709&nearbyArea=710&nearbyArea=92&nearbyArea=96&nearbyArea=97&purveyor=owner&searchNearby=2&sort=date&ddd=ddd#search=1~thumb~0~0`,
    //   ),
    // );

    console.log(url);

    console.log(url)

    if(this.locker.isInProcess(url)){
      console.log('INPROCESS',url);
      res.send({ data: 'No change', isNotNeeded: true });
    }

    this.locker.setUrlInProcess(url);

    this.proxyRequest
      .getProxyRequest(url + `&${randomQuery}=${randomQuery}`)
      .then((body) => {
        try {
          this.htmlToJson.getJson(body).done((result) => {
            this.locker.setUrlProcessFinished(url);

            var page = result;

            console.log("FIRST:",result.cars.filter[0]);
            console.log("LAST:",result.cars.filter[result.cars.filter.length-1]);

            let names =
              result?.cars?.filter[0]?.name +
              result?.cars?.filter[1]?.name +
              result?.cars?.filter[2]?.name
                ? result?.cars?.filter[0]?.name +
                  result?.cars?.filter[1]?.name +
                  result?.cars?.filter[2]?.name
                : '';
           


            if (this.hash.hashExist(url,names) || body == 'error') {
              if(isfirstTime){
                res.send(page);
              }else{
                res.send({ data: 'No change', isNotNeeded: true });
              }
            }  else {
              this.hash.setClientSaw(clientCode, names);
              this.hash.setUrlHash(url,names);
              res.send(page);
            }
          });
        } catch (error) {
          this.locker.setUrlProcessFinished(url);
          console.log(error);
          res.send({ data: 'No change', isNotNeeded: true, error: true });
        }
      });
    // console.log(response.data);

    // console.log(this.hash + ' this is hash ass was', hash + ' this is not');

    // if (this.hash == hash) {
    //   return { data: 'No change', isNotNeeded: true };
    // }
    // this.hash = hash;
    // return { data: response.data };
  }
}
