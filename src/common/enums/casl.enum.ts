export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum Resource {
  ALL = 'all',
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  SYSTEM_CONFIG = 'system_config',
  SECRET = 'secret',
  EXPORT = 'export',
  TIER_CONFIG = 'tier_config',
  IMPORT = 'import',
  STATISTIC = 'statistic',
  SUBJECT = 'subject',
  NEWS = 'news',
}

export enum ActionAbility {
  CAN = 'can',
  CANNOT = 'cannot',
}
