declare namespace Cypress {
  interface Chainable {
    typeEmail(email: string): Chainable<Element>;
    typePassword(password: string): Chainable<Element>;
    submitSignIn(): Chainable<Element>;
    assertFieldValue(selector: string, value: string): Chainable<Element>;
    assertErrorMessage(text?: string | RegExp): Chainable<Element>;
    assertErrorNotificationVisible(): Chainable<Element>;
    assertNoErrorNotification(): Chainable<Element>;
    signIn(email: string, password: string): Chainable<Element>;
    mockSuccessfulLogin(): Chainable<null>;
    mockFailedLogin(statusCode?: number, message?: string): Chainable<null>;
  }
  interface SuiteConfigOverrides {
    tags?: string | string[];
  }
}
