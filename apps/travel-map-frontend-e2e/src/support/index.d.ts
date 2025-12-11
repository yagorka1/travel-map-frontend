declare namespace Cypress {
  interface Chainable {
    // Sign-in commands
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
    setupAuthMocks(): Chainable<null>;
    loginUI(email?: string, password?: string): Chainable<null>;
    mockRefreshToken(success?: boolean): Chainable<null>;

    // Dashboard commands
    visitDashboard(): Chainable<Element>;
    mockDashboardData(
      statsOverride?: Record<string, unknown>,
      levelsOverride?: Record<string, unknown>[],
    ): Chainable<null>;
    mockDashboardError(statusCode?: number, message?: string): Chainable<null>;
    waitForDashboardLoad(): Chainable<null>;
    assertStatCard(index: number, expectedTitle: string, expectedValue?: string): Chainable<Element>;
    assertPointsAndLevel(expectedPoints?: number, expectedLevel?: number): Chainable<Element>;
    assertMapVisible(): Chainable<Element>;
    assertDashboardLoaded(): Chainable<Element>;

    // Settings commands
    updateProfileAPI(token: string, profileData: { name: string; language: string }): Chainable<Response<any>>;
    changePasswordAPI(
      token: string,
      passwordData: { currentPassword: string; newPassword: string; confirmPassword: string },
    ): Chainable<Response<any>>;
  }
  interface SuiteConfigOverrides {
    tags?: string | string[];
  }
}
