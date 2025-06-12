export interface ResponseStatus {
  status: 'success' | 'canceled'
  packageManagerNotFound?: boolean
}
