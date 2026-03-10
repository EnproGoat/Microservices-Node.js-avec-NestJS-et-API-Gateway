export class InvalidStatusTransitionException extends Error {
  constructor(from: string, to: string) {
    super(`Cannot transition order from ${from} to ${to}`);
  }
}
