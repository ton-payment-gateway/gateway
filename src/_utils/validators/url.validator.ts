import * as net from 'net';
import * as url from 'url';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNotIpOrLocalhost', async: false })
export class IsNotIpOrLocalhostConstraint
  implements ValidatorConstraintInterface
{
  validate(webhookUrl: string) {
    try {
      const parsedUrl = new url.URL(webhookUrl);
      const hostname = parsedUrl.hostname;

      const isIp = net.isIP(hostname) !== 0;

      return !(isIp || hostname === 'localhost' || hostname.endsWith('.local'));
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return 'Webhook URL must be a valid domain (not an IP address or localhost).';
  }
}
