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
  cy.get(signInPage.passwordInput).should('not.be.disabled').clear();
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

Cypress.Commands.add('setupAuthMocks', () => {
  cy.fixture('dashboard.json').then((dashboard) => {
    // Setup common API mocks
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: { accessToken: 'mock-jwt-token' },
    }).as('loginRequest');

    cy.intercept('POST', '**/auth/refresh', {
      statusCode: 401,
      body: { message: 'No valid refresh token' },
    }).as('refreshRequestFail');

    cy.intercept('GET', '**/users/profile', {
      statusCode: 200,
      body: dashboard.mockResponses.profile,
    }).as('getProfile');

    cy.intercept('GET', '**/chats/unread-messages', {
      statusCode: 200,
      body: dashboard.mockResponses.unreadMessages,
    }).as('getUnreadMessages');
  });
});

Cypress.Commands.add('loginUI', (email = 'test@email.com', password = 'test@email.com') => {
  cy.visit('/auth/sign-in');
  cy.typeEmail(email);
  cy.typePassword(password);
  cy.submitSignIn();
  cy.wait('@loginRequest');
});

Cypress.Commands.add('mockRefreshToken', (success = true) => {
  if (success) {
    cy.intercept('POST', '**/auth/refresh', {
      statusCode: 200,
      body: { accessToken: 'mock-jwt-token-refreshed' },
    }).as('refreshRequestSuccess');
  } else {
    cy.intercept('POST', '**/auth/refresh', {
      statusCode: 401,
      body: { message: 'No valid refresh token' },
    }).as('refreshRequestFail');
  }
});
