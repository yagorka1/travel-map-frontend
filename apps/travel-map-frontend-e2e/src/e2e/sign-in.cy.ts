import '../support/sign-in.commands';
import { signInPage } from '../support/sign-in.commands';

describe('Sign In Flow - UI & Mocked API', () => {
  beforeEach(() => {
    cy.visit('/auth/sign-in');
  });

  describe('Page Elements', () => {
    it('should display all required elements', () => {
      cy.get(signInPage.signInLogo).should('be.visible');
      cy.get(signInPage.signInHeading).should('be.visible');
      cy.get(signInPage.signUpLink).should('be.visible').should('have.attr', 'href').and('include', '/auth/sign-up');
      cy.get(signInPage.emailInput).should('be.visible');
      cy.get(signInPage.passwordInput).should('be.visible');
      cy.get(signInPage.forgotPasswordLink)
        .should('be.visible')
        .should('have.attr', 'href')
        .and('include', '/auth/forgot-password');
      cy.get(signInPage.submitButton).should('be.visible');
    });
  });

  describe('Form Validation', () => {
    it('should not submit empty fields', () => {
      cy.submitSignIn();
      cy.url().should('include', '/auth/sign-in');
      cy.get(signInPage.emailInput).should('be.visible');
    });

    it('should not submit invalid email', () => {
      cy.typeEmail('invalid-email');
      cy.typePassword('password123');
      cy.submitSignIn();
      cy.url().should('include', '/auth/sign-in');
    });

    it('should not submit when password is empty', () => {
      cy.typeEmail('test@example.com');
      cy.submitSignIn();
      cy.url().should('include', '/auth/sign-in');
    });

    it('should not submit when email is empty', () => {
      cy.typePassword('password123');
      cy.submitSignIn();
      cy.url().should('include', '/auth/sign-in');
    });

    it('should handle edge case - very long password', () => {
      const longPassword = 'a'.repeat(500);
      cy.typeEmail('test@example.com');
      cy.get(signInPage.passwordInput).clear();
      cy.get(signInPage.passwordInput).type(longPassword, { delay: 0 });
      cy.get(signInPage.passwordInput).should('have.value', longPassword);
    });

    it('should handle special characters in password', () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:",.<>?/~`';
      cy.typeEmail('test@example.com');
      cy.get(signInPage.passwordInput).clear();
      cy.get(signInPage.passwordInput).type(specialPassword);
      cy.get(signInPage.passwordInput).should('have.value', specialPassword);
    });
  });

  describe('Successful Sign In (Mocked)', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: { accessToken: 'mock-jwt-token' },
      }).as('loginRequest');
    });

    it('should sign in with valid credentials', () => {
      cy.typeEmail('test@email.com');
      cy.typePassword('test@email.com');
      cy.submitSignIn();

      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body).to.have.property('accessToken');
      });

      cy.url().should('not.include', '/auth/sign-in');
    });

    it('should handle multiple valid email formats', () => {
      const emails = ['user@example.com', 'user.name@example.com', 'user+tag@example.co.uk', 'user123@test-domain.com'];

      emails.forEach((email, index) => {
        if (index > 0) cy.visit('/auth/sign-in');
        cy.typeEmail(email);
        cy.typePassword('password123');
        cy.submitSignIn();
        cy.wait('@loginRequest');
        cy.url().should('not.include', '/auth/sign-in');
      });
    });
  });

  describe('Failed Sign In (Mocked)', () => {
    it('should show error notification for invalid credentials', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: { message: 'Incorrect login or password' },
      }).as('loginRequest');

      cy.typeEmail('wrong@example.com');
      cy.typePassword('wrongpassword');
      cy.submitSignIn();

      cy.wait('@loginRequest');
      cy.url().should('include', '/auth/sign-in');
      cy.get('lib-notifications').should('be.visible');
      cy.get('lib-notifications .font-normal').should('exist');
    });

    it('should show error notification for server error', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 500,
        body: { message: 'Internal server error' },
      }).as('loginRequest');

      cy.typeEmail('test@example.com');
      cy.typePassword('password123');
      cy.submitSignIn();

      cy.wait('@loginRequest');
      cy.url().should('include', '/auth/sign-in');
      cy.get('lib-notifications').should('be.visible');
    });

    it('should show error notification for network errors', () => {
      cy.intercept('POST', '**/auth/login', { forceNetworkError: true }).as('loginRequest');

      cy.typeEmail('test@example.com');
      cy.typePassword('password123');
      cy.submitSignIn();

      cy.wait('@loginRequest');
      cy.url().should('include', '/auth/sign-in');
      cy.get('lib-notifications').should('be.visible');
    });

    it('should allow retry after failed login', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: { message: 'Incorrect login or password' },
      }).as('loginRequestFail');

      cy.typeEmail('wrong@example.com');
      cy.typePassword('wrongpassword');
      cy.submitSignIn();
      cy.wait('@loginRequestFail');

      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: { accessToken: 'mock-jwt-token' },
      }).as('loginRequestSuccess');

      cy.get(signInPage.emailInput).clear();
      cy.typeEmail('correct@example.com');
      cy.get(signInPage.passwordInput).clear();
      cy.typePassword('correctpassword');
      cy.submitSignIn();
      cy.wait('@loginRequestSuccess');
      cy.url().should('not.include', '/auth/sign-in');
    });
  });

  describe('Form Interaction', () => {
    it('should type and assert fields safely', () => {
      cy.typeEmail('test@example.com');
      cy.assertFieldValue(signInPage.emailInput, 'test@example.com');

      cy.typePassword('mypassword123');
      cy.assertFieldValue(signInPage.passwordInput, 'mypassword123');
    });

    it('should mask password input', () => {
      cy.get(signInPage.passwordInput).should('have.attr', 'type', 'password');
    });

    it('should clear fields safely', () => {
      cy.typeEmail('test@example.com');
      cy.get(signInPage.emailInput).clear();
      cy.assertFieldValue(signInPage.emailInput, '');

      cy.typePassword('password123');
      cy.get(signInPage.passwordInput).clear();
      cy.assertFieldValue(signInPage.passwordInput, '');
    });

    it('should submit form using Enter key in password field', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: { accessToken: 'mock-jwt-token' },
      }).as('loginRequest');

      cy.typeEmail('test@example.com');
      cy.get(signInPage.passwordInput).type('password123{enter}');
      cy.wait('@loginRequest');
    });

    it('should handle rapid form field updates', () => {
      cy.get(signInPage.emailInput).type('test');
      cy.get(signInPage.emailInput).clear();
      cy.get(signInPage.emailInput).type('test2');
      cy.get(signInPage.emailInput).clear();
      cy.typeEmail('final@example.com');
      cy.assertFieldValue(signInPage.emailInput, 'final@example.com');
    });
  });

  describe('Navigation', () => {
    it('should navigate to sign-up page', () => {
      cy.get(signInPage.signUpLink).click();
      cy.url().should('include', '/auth/sign-up');
    });

    // it('should navigate to forgot password page', () => {
    //   cy.get(signInPage.forgotPasswordLink).click();
    //   cy.url().should('include', '/auth/forgot-password');
    // });
  });

  describe('Security', () => {
    it('should not expose password in URL', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: { accessToken: 'mock-jwt-token' },
      }).as('loginRequest');

      cy.typeEmail('test@example.com');
      cy.typePassword('secretPassword123');
      cy.submitSignIn();

      cy.wait('@loginRequest').then((interception) => {
        expect(interception.request.url).to.not.include('secretPassword123');
      });
    });

    it('should send credentials in request body', () => {
      cy.intercept('POST', '**/auth/login').as('loginRequest');

      cy.typeEmail('test@example.com');
      cy.typePassword('myPassword');
      cy.submitSignIn();

      cy.wait('@loginRequest').then((interception) => {
        expect(interception.request.body).to.have.property('email');
        expect(interception.request.body).to.have.property('password');
      });
    });
  });
});

// ============================================
// Real API Integration Tests
// ============================================
// Tag: @integration
// Run separately: npx cypress run --spec "cypress/e2e/sign-in-integration.cy.ts"

describe('Sign In Flow - Real API Integration', { tags: '@integration' }, () => {
  beforeEach(() => {
    cy.visit('/auth/sign-in');
  });

  describe('End-to-End Sign In', () => {
    it('should sign in and access protected page', () => {
      const email = 'test@email.com';
      const password = 'test@email.com';

      cy.typeEmail(email);
      cy.typePassword(password);
      cy.submitSignIn();

      cy.url().should('include', '/dashboard', { timeout: 10000 });

      cy.getCookies().then((cookies) => {
        const refreshCookie = cookies.find((c) => c.name.toLowerCase().includes('refresh'));
        assert.exists(refreshCookie, 'refresh token cookie should exist');
      });

      cy.reload();
      cy.url().should('include', '/dashboard');
    });

    it('should persist session after page refresh', () => {
      cy.typeEmail('test@email.com');
      cy.typePassword('test@email.com');
      cy.submitSignIn();

      cy.url().should('include', '/dashboard', { timeout: 10000 });

      cy.reload();

      cy.url().should('include', '/dashboard');
      cy.url().should('not.include', '/auth/sign-in');
    });

    it('should not allow unauthenticated access to protected pages', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/auth/sign-in', { timeout: 5000 });
    });

    it('should redirect authenticated users away from sign-in', () => {
      cy.typeEmail('test@email.com');
      cy.typePassword('test@email.com');
      cy.submitSignIn();
      cy.url().should('include', '/dashboard', { timeout: 10000 });

      cy.visit('/auth/sign-in');
      cy.url().should('not.include', '/auth/sign-in', { timeout: 5000 });
    });
  });

  describe('Real API Error Handling', () => {
    it('should handle invalid credentials from real API', () => {
      cy.typeEmail('invalid@example.com');
      cy.typePassword('wrongpassword');
      cy.submitSignIn();

      cy.url().should('include', '/auth/sign-in');
      cy.get('lib-notifications').should('be.visible');
    });

    it('should handle malformed email from real API', () => {
      cy.get(signInPage.emailInput).type('not-an-email');
      cy.typePassword('password123');
      cy.submitSignIn();

      cy.url().should('include', '/auth/sign-in');
    });
  });
});
