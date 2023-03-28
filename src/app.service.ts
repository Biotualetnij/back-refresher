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
  ) {
    setInterval(() => {
      this.bundleDuplicates = 12;
    }, 20 * 60 * 1000);
  }
  private bundleDuplicates: number = 12;
  async getRefreshedPage(
    url: string,
    res: Response,
    isfirstTime: boolean,
    clientCode: boolean,
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const randomQuery = Date.now();
      // const response = await firstValueFrom(
      //   this.http.get(
      //     `https://sfbay.craigslist.org/search/cta?auto_title_status=1&nearbyArea=102&nearbyArea=12&dd=ss&nearbyArea=187&nearbyArea=188&nearbyArea=189&nearbyArea=191&nearbyArea=208&nearbyArea=285&nearbyArea=346&nearbyArea=373&nearbyArea=43&nearbyArea=454&nearbyArea=456&nearbyArea=62&nearbyArea=63&nearbyArea=708&nearbyArea=709&nearbyArea=710&nearbyArea=92&nearbyArea=96&nearbyArea=97&purveyor=owner&searchNearby=2&sort=date&ddd=ddd#search=1~thumb~0~0`,
      //   ),
      // );

      console.log(url);

      if (this.locker.isInProcess(url)) {
        console.log('INPROCESS', url);
        setTimeout(() => {
          resolve({ data: 'No change', isNotNeeded: true });
        }, 3000);
        return;
      }
      console.log(this.bundleDuplicates);
      this.locker.setUrlInProcess(url);
      this.bundleDuplicates++;
      let query = `?bundleDuplicates=${this.bundleDuplicates}&${randomQuery}=${randomQuery}`;
      if (url.indexOf('?') > -1) {
        query = `&bundleDuplicates=${this.bundleDuplicates}&${randomQuery}=${randomQuery}`;
      }
      let data = url.match(/#search=\d+~\w+~\d+~\d+/);
      url = url.replace(/#search=\d+~\w+~\d+~\d+/, '');

      this.proxyRequest
        .getProxyRequest(url + `${query}` + data[0])
        .then((body) => {
          try {
            this.htmlToJson.getJson(body).done((result) => {
              this.locker.setUrlProcessFinished(url + data[0]);

              var page = result;

              console.log('FIRST:', result.cars.filter[0]);
              console.log(
                'LAST:',
                result.cars.filter[result.cars.filter.length - 1],
              );

              let names =
                result?.cars?.filter[0]?.name +
                result?.cars?.filter[1]?.name +
                result?.cars?.filter[2]?.name
                  ? result?.cars?.filter[0]?.name +
                    result?.cars?.filter[1]?.name +
                    result?.cars?.filter[2]?.name
                  : '';
              if (
                this.hash.hashExist(url + data[0], names) ||
                body == 'error'
              ) {
                if (
                  isfirstTime ||
                  !this.hash.clientSawHash(clientCode, names)
                ) {
                  this.hash.setClientSaw(clientCode, names);

                  resolve(page);
                  return;
                } else {
                  setTimeout(() => {
                    resolve({ data: 'No change', isNotNeeded: true });
                  }, 1000);
                  return;
                }
              } else {
                this.hash.setClientSaw(clientCode, names);
                this.hash.setUrlHash(url + data[0], names);

                resolve(page);
                return;
              }
            });
          } catch (error) {
            this.locker.setUrlProcessFinished(url + data[0]);
            console.log(error);
            setTimeout(() => {
              resolve({ data: 'No change', isNotNeeded: true, error: true });
            }, 3000);
            return;
          }
        });
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
