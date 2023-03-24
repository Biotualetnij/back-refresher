import { Injectable } from '@nestjs/common';
const puppeteer = require('puppeteer');

@Injectable()
export class ProxyRequestService {
  browser;
  constructor() {
    this.rotateProxy();
  }
  page;
  proxy = [
    '--proxy-server=http://gate.smartproxy.com:10000',
    '--proxy-server=http://gate.smartproxy.com:10001',
    '--proxy-server=http://gate.smartproxy.com:10002',
    '--proxy-server=http://gate.smartproxy.com:10003',
    '--proxy-server=http://gate.smartproxy.com:10004',
    '--proxy-server=http://gate.smartproxy.com:10005',
    '--proxy-server=http://gate.smartproxy.com:10006',
    '--proxy-server=http://gate.smartproxy.com:10007',
    '--proxy-server=http://gate.smartproxy.com:10008',
    '--proxy-server=http://gate.smartproxy.com:10009',
  ];
  username = 'spfa027314';
  password = 'qwerty';
  currentProxyIndex = 0;
  init = async () => {
    while (true) {
      this.browser = await puppeteer.launch({
        headless: false,
        args: [
          this.proxy[this.currentProxyIndex],
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
        ignoreDefaultArgs: ['--disable-extensions'],
      });
      break;
    }

    this.page = await this.browser.newPage();
    await this.page.authenticate({
      username: this.username,
      password: this.password,
    });
  };
  async rotateProxy() {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxy.length;
    console.log(
      'rotated proxy////////////////////////////////////////////////////////////////////////',
    );
    if (await this.browser?.isConnected()) {
      await this.browser.close();
    }
    // Schedule the next proxy rotation
    setTimeout(this.rotateProxy, 3 * 60 * 1000);
  }

  async getProxyRequest(link) {
    try {
      if (!(await this.browser?.isConnected())) {
        await this.init();
      }
      await this.page.setDefaultNavigationTimeout(0);
      console.log('goto');
      await this.page.goto(link);
      console.log('wait request');

      await this.page.waitForRequest(
        (request) => request.url().includes('0-1080'),
        { timeout: 10000 },
      );
      await this.page.waitForTimeout(1000);
      console.log('wait for content');
      const txt = await this.page.content();

      // cosnole.log(txt);
      return txt;
    } catch (e) {
      return 'error';
    }
  }
}
