export type ValidateLoginRequest = {
    username: string;
    rememberMe: boolean;
    clientPublicEphemeral: string;
    clientSessionProof: string;
}

export type ValidateLoginRequest2Fa = {
    username: string;
    code2Fa: number;
    rememberMe: boolean;
    clientPublicEphemeral: string;
    clientSessionProof: string;
}

export type ValidateLoginResponse = {
    requiresTwoFactor: boolean;
    token?: {
      token: string;
      refreshToken: string;
    };
    serverSessionProof: string;
  }