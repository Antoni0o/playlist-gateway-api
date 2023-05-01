export class SendGridServiceMock {
  public async send(code: string, email: string) {
    return `Mail sent to ${email} with code ${code}!`;
  }
}
