import {
  Injectable,
  Inject,
  ConsoleLogger,
  OnApplicationShutdown,
  LogLevel,
  Scope,
} from '@nestjs/common';
import {
  Options,
  SeverityLevel,
  // User as SentryUser,
  // Session as SentrySession,
  // Scope as SentryScope,
  // SerializedSession,
} from '@sentry/types';
import * as Sentry from '@sentry/node';

@Injectable({ scope: Scope.REQUEST })
export class SentryService extends ConsoleLogger implements OnApplicationShutdown {
  appName = '@centergame/nestjs-sentry: ';

  private static serviceInstance: SentryService;

  private static logLevelToSeverityMap = {
    verbose: 'info',
    warn: 'warning',
  };

  constructor(@Inject('MY_LOGGER_OPTIONS') readonly opts?: Options) {
    super();
    if (!(opts && opts.dsn)) {
      // console.log('options not found. Did you use SentryModule.forRoot?');
      return;
    }
    const { debug, integrations = [], ...sentryOptions } = opts;
    Sentry.init({
      ...sentryOptions,
      integrations,
    });
  }

  error(input: any, ...optionalParams: any[]) {
    this.throw('error', false, input, ...optionalParams);
  }

  log(input: any, ...optionalParams: any[]) {
    this.throw('log', true, input, ...optionalParams);
  }

  verbose(input: any, ...optionalParams: any[]) {
    this.throw('verbose', true, input, ...optionalParams);
  }

  warn(input: any, ...optionalParams: any[]) {
    this.throw('warn', true, input, ...optionalParams);
  }

  debug(input: any, ...optionalParams: any[]) {
    this.throw('debug', true, input, ...optionalParams);
  }

  private getSeverityLevel(logLevel: LogLevel): SeverityLevel {
    const mapMatch = SentryService.logLevelToSeverityMap[logLevel];
    return mapMatch || logLevel;
  }

  /**
   * Fired log event will propagade to sentry if dsn was defined. With severity level specified in relation to log level
   * Also all but error event will be created as sentry's breadcrumbs
   */
  private throw(logLevel: LogLevel, asBreadcrumb: boolean, input: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled(logLevel) || !input) {
      return;
    }
    let message = input;
    if (typeof input !== 'string') {
      message = JSON.stringify(input);
    }

    message = `${this.appName} ${message}`;

    try {
      super[logLevel](message, ...optionalParams);

      const severityLevel: SeverityLevel = this.getSeverityLevel(logLevel);
      const data = [...optionalParams.filter((el) => !!el)];
      const context = data.pop();
      // const context = optionalParams[optionalParams.length - 1];
      if (asBreadcrumb) {
        const category = context || 'generic';

        const payload = {
          message,
          level: severityLevel,
          category,
        };
        if (data.length > 0) {
          payload['data'] = data;
        }

        Sentry.withScope((scope) => {
          Sentry.addBreadcrumb(payload);
        });
      } else {
        Sentry.withScope((scope) => {
          Sentry.captureMessage(message, severityLevel);
        });
      }
    } catch (err) {
      //
    }
  }

  /*
  private setUserScope(scope: SentryScope) {
    const whoami = this.req.session.whoami;
    let user: SentryUser = undefined;

    if (whoami.id) {
      user = {
        id: whoami?.id,
        email: whoami?.email,
      };
    }

    if (user) {
      scope.setUser(user);
    }
  }

  private withSentryScope(callback: () => void) {
    if (this?.req?.session) {
      Sentry.withScope((scope) => {
        this.setUserScope(scope);
        callback();
      });
    }
  }
  */

  public static SentryServiceInstance(): SentryService {
    if (!SentryService.serviceInstance) {
      SentryService.serviceInstance = new SentryService();
    }
    return SentryService.serviceInstance;
  }

  get SentryInstance() {
    return Sentry;
  }

  async onApplicationShutdown(signal?: string) {
    await Sentry.close();
  }
}
