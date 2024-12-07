import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import OktaJwtVerifier from '@okta/jwt-verifier';

@Injectable()
export class AuthService {
  private oktaJwtVerifier: OktaJwtVerifier;
  private audience: string;

  constructor(private readonly config: ConfigService) {
    this.oktaJwtVerifier = new OktaJwtVerifier({
      issuer: this.config.get('OKTA_ISSUER'),
      clientId: this.config.get('OKTA_CLIENTID'),
    });

    this.audience = this.config.get('OKTA_AUDIENCE');
  }

  async validateToken(token: string): Promise<any> {
    try {
      const jwt = await this.oktaJwtVerifier.verifyAccessToken(
        token,
        this.audience,
      );
      return jwt;
    } catch (err) {
      throw new UnauthorizedException('Invalid token', err.message);
    }
  }
}
