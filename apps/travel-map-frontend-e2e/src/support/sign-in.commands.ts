export const signInPage = {
  emailInput: '[data-testid="email-input"]',
  passwordInput: '[data-testid="password-input"]',
  submitButton: '[data-testid="submit-button"]',
  signUpLink: '[data-testid="sign-up-link"]',
  forgotPasswordLink: '[data-testid="forgot-password-link"]',
  signInLogo: '[data-testid="sign-in-logo"]',
  signInHeading: '[data-testid="sign-in-heading"]',
  errorMessage: '[data-testid="error-message"]',
  notifications: 'lib-notifications',
  notificationText: 'lib-notifications .font-normal',
};

Cypress.Commands.add('typeEmail', (email: string) => {
  cy.get(signInPage.emailInput).clear();
  cy.get(signInPage.emailInput).type(email);
  cy.get(signInPage.emailInput).should('have.value', email);
});

Cypress.Commands.add('typePassword', (password: string) => {
  cy.get(signInPage.passwordInput).clear();
  cy.get(signInPage.passwordInput).type(password);
  cy.get(signInPage.passwordInput).should('have.value', password);
});

Cypress.Commands.add('submitSignIn', () => {
  cy.get(signInPage.submitButton).click();
});

Cypress.Commands.add('assertFieldValue', (selector: string, value: string) => {
  cy.get(selector).should('have.value', value);
});

Cypress.Commands.add('assertErrorMessage', (message?: string | RegExp) => {
  cy.get(signInPage.notificationText).should('be.visible');

  if (message) {
    if (typeof message === 'string') {
      cy.get(signInPage.notificationText).should('contain.text', message);
    } else {
      cy.get(signInPage.notificationText).invoke('text').should('match', message);
    }
  }
});

Cypress.Commands.add('assertErrorNotificationVisible', () => {
  cy.get(signInPage.notifications).should('be.visible');
  cy.get(signInPage.notificationText).should('exist');
});

Cypress.Commands.add('assertNoErrorNotification', () => {
  cy.get(signInPage.notifications).should('not.exist');
});

Cypress.Commands.add('signIn', (email: string, password: string) => {
  cy.typeEmail(email);
  cy.typePassword(password);
  cy.submitSignIn();
});

Cypress.Commands.add('mockSuccessfulLogin', () => {
  cy.fixture('auth.json').then((auth) => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: auth.mockResponses.success.statusCode,
      body: auth.mockResponses.success.body,
    }).as('loginRequest');
  });
});

Cypress.Commands.add('mockFailedLogin', (statusCode = 401, message = 'Incorrect login or password') => {
  cy.intercept('POST', '**/auth/login', {
    statusCode: statusCode,
    body: { message: message },
  }).as('loginRequest');
});
