import { Injectable } from '@nestjs/common';
var htmlToJson = require('html-to-json');
@Injectable()
export class HtmlToJsonService {
  id: string;
  getJson(body) {
    return htmlToJson.parse(
      body,
      {
        cars: htmlToJson.createParser([
          '.cl-search-result',
          {
            id: function (row) {
              var id = row;
              return id[0]?.attribs['data-pid'];
            },
            link: function (row) {
              var link = row.find('.titlestring');
              return link[0].attribs.href;
            },

            img: function (row) {
              var link = row.find('.cl-thumb')[0];
              return link?.attribs?.src;
            },
            price: function (row) {
              var price = row.find('.priceinfo');

              return price[0]?.childNodes[0]?.data;
            },
            name: function (row) {
              var name = row.find('.supertitle');
              return name?.text();
            },
            title: function (row) {
              var name = row.find('.titlestring');
              return name?.text();
            },
            date: function (row) {
              var date = row.find('.meta')[0];
              return date?.childNodes[0]?.attribs?.title;
            },
          },
        ]),
      },
      function (err, result) {},
    );
  }
}
