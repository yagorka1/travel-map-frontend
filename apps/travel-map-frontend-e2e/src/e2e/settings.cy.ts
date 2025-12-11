import { settingsPage } from '../support/settings.commands';
import '../support/sign-in.commands';

describe('Settings', { testIsolation: true }, () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.setupAuthMocks();
    cy.loginUI();
    cy.mockRefreshToken(true);
    cy.visit('/settings');
    cy.fixture('settings.json').as('settings');
  });

  it('should open settings page', () => {
    cy.url().should('include', '/settings/profile');
    cy.get('[data-testid="settings-title"]').should('be.visible');
    cy.get(settingsPage.settingsProfileLink).should('be.visible');
    cy.get(settingsPage.settingsPasswordLink).should('be.visible');
  });

  describe('profile tab', () => {
    beforeEach(() => {
      cy.get(settingsPage.settingsProfileLink).click();
    });

    it('should exist on profile page', () => {
      cy.get(settingsPage.profileTitle).should('be.visible');
      cy.get(settingsPage.nameInput).should('be.visible');
      cy.get(settingsPage.emailInput).should('be.visible');
      cy.get(settingsPage.emailInput).should('be.disabled');
      cy.get(settingsPage.languageSelect).scrollIntoView();
      cy.get(settingsPage.languageSelect).should('be.visible');
    });

    it('button should be disabled when form is invalid', () => {
      cy.get(settingsPage.nameInput).clear();
      cy.get(settingsPage.profileButton).scrollIntoView();
      cy.get(settingsPage.profileButton).should('be.disabled');
    });

    it('button should be enabled when form is valid', () => {
      cy.get('@settings').then((settings: any) => {
        cy.get(settingsPage.nameInput).clear();

        cy.get(settingsPage.profileButton).should('be.disabled');

        cy.get(settingsPage.nameInput).type(settings.profile.valid.name);
        cy.get(settingsPage.emailInput).should('be.disabled');

        cy.get(settingsPage.profileButton).should('not.be.disabled');
      });
    });

    describe('API Settings profile', () => {
      before(() => {
        cy.fixture('settings.json').then((settings) => {
          cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/auth/login',
            body: settings.api.login,
          }).then((res) => {
            Cypress.env('token', res.body.accessToken);
          });
        });
      });

      it('should update profile', () => {
        const token = Cypress.env('token');
        cy.get('@settings').then((settings: any) => {
          cy.updateProfileAPI(token, settings.profile.update).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.include(settings.profile.update);
          });
        });
      });
    });
  });

  describe('change password tab', () => {
    beforeEach(() => {
      cy.get(settingsPage.settingsPasswordLink).click();
    });

    it('should open change password page', () => {
      cy.url().should('include', '/settings/password');
    });

    it('should exist on change password page', () => {
      cy.get(settingsPage.changePasswordTitle).should('be.visible');
      cy.get(settingsPage.currentPasswordInput).should('be.visible');
      cy.get(settingsPage.newPasswordInput).should('be.visible');
      cy.get(settingsPage.confirmPasswordInput).should('be.visible');
      cy.get(settingsPage.changePasswordButton).should('be.visible');
    });

    it('should be disabled when form is invalid', () => {
      cy.get(settingsPage.changePasswordButton).should('be.disabled');
    });

    it('should update password when form is valid', () => {
      cy.get('@settings').then((settings: any) => {
        cy.get(settingsPage.currentPasswordInput).type(settings.password.default);
        cy.get(settingsPage.newPasswordInput).type(settings.password.default);
        cy.get(settingsPage.confirmPasswordInput).type(settings.password.default);
        cy.get(settingsPage.changePasswordButton).should('not.be.disabled');
      });
    });

    it('should disable button if passwords do not match', () => {
      cy.get('@settings').then((settings: any) => {
        cy.get(settingsPage.newPasswordInput).type(settings.password.invalid.mismatch.new);
        cy.get(settingsPage.confirmPasswordInput).type(settings.password.invalid.mismatch.confirm);

        cy.get(settingsPage.changePasswordButton).should('be.disabled');
      });
    });

    it('should send correct request when changing password', () => {
      cy.get('@settings').then((settings: any) => {
        cy.intercept('POST', '**/api/users/change-password', {
          statusCode: 200,
          body: { success: true, message: 'Password changed successfully' },
        }).as('changePasswordRequest');

        cy.get(settingsPage.currentPasswordInput).type(settings.password.valid.current);
        cy.get(settingsPage.newPasswordInput).type(settings.password.valid.new);
        cy.get(settingsPage.confirmPasswordInput).type(settings.password.valid.new);
        cy.get(settingsPage.changePasswordButton).should('not.be.disabled');

        cy.get(settingsPage.changePasswordButton).click();
        cy.wait('@changePasswordRequest').then((interception) => {
          expect(interception.request.body).to.have.property('currentPassword', settings.password.valid.current);
          expect(interception.request.body).to.have.property('newPassword', settings.password.valid.new);
          expect(interception.request.body).to.have.property('confirmPassword', settings.password.valid.new);
          expect(interception.request.headers).to.have.property('content-type', 'application/json');
          expect(interception?.response?.statusCode).to.eq(200);
          expect(interception?.response?.body).to.have.property('success', true);
        });

        cy.contains('Password changed successfully').should('be.visible');
      });
    });

    describe('API Settings', () => {
      before(() => {
        cy.fixture('settings.json').then((settings) => {
          cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/auth/login',
            body: settings.api.login,
          }).then((res) => {
            Cypress.env('token', res.body.accessToken);
          });
        });
      });

      it('should change password', () => {
        const token = Cypress.env('token');
        cy.get('@settings').then((settings: any) => {
          cy.changePasswordAPI(token, {
            currentPassword: settings.password.valid.current,
            newPassword: settings.password.valid.new,
            confirmPassword: settings.password.valid.new,
          }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('message', 'Password changed successfully');
          });
        });
      });
    });
  });
});
