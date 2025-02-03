import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class BaseLogger extends ConsoleLogger {}
