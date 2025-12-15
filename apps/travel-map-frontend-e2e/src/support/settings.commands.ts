export const settingsPage = {
  profileTitle: '[data-testid="profile-title"]',
  nameInput: '[data-testid="profile-name-input"]',
  emailInput: '[data-testid="profile-email-input"]',
  languageSelect: '[data-testid="profile-language-select"]',
  profileButton: '[data-testid="profile-button"]',
  settingsProfileLink: '[data-testid="settings-profile-link"]',
  settingsPasswordLink: '[data-testid="settings-password-link"]',

  changePasswordTitle: '[data-testid="change-password-title"]',
  currentPasswordInput: '[data-testid="current-password-input"]',
  newPasswordInput: '[data-testid="new-password-input"]',
  confirmPasswordInput: '[data-testid="confirm-password-input"]',
  changePasswordButton: '[data-testid="change-password-button"]',
};

Cypress.Commands.add('updateProfileAPI', (token: string, profileData: { name: string; language: string }) => {
  cy.request({
    method: 'PATCH',
    url: 'http://localhost:3000/api/users/profile',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: profileData,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add(
  'changePasswordAPI',
  (token: string, passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/users/change-password',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: passwordData,
      failOnStatusCode: false,
    });
  },
);
