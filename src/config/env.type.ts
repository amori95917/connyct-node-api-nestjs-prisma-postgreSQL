export enum EnvironmentVariables {
  jwtSecret = 'JWT_SECRET',
}

export interface EnvType {
  [EnvironmentVariables.jwtSecret]: string;
}
