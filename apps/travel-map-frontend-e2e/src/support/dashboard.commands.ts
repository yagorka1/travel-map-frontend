export const dashboardPage = {
  // Stat cards
  statCards: '[data-testid="stat-card"]',
  statCardIcon: '[data-testid="stat-card-icon"]',
  statCardTitle: '[data-testid="stat-card-title"]',
  statCardValue: '[data-testid="stat-card-value"]',

  // Points and level card
  pointsLevelCard: '[data-testid="points-level-card"]',
  totalPoints: '[data-testid="total-points"]',
  currentLevel: '[data-testid="current-level"]',
  progressBar: '[data-testid="progress-bar"]',
  progressText: '[data-testid="progress-text"]',

  // Map
  map: '[data-testid="map"]',
  mapContainer: '.leaflet-container',

  // Dashboard container
  dashboardContainer: '.bg-gray-50',
};

Cypress.Commands.add('visitDashboard', () => {
  cy.visit('/dashboard');
});

Cypress.Commands.add(
  'mockDashboardData',
  (statsOverride: Record<string, unknown> = {}, levelsOverride: Record<string, unknown>[] = []) => {
    cy.fixture('dashboard.json').then((dashboard) => {
      const stats = { ...dashboard.mockResponses.dashboardStats, ...statsOverride };
      const levels = levelsOverride.length > 0 ? levelsOverride : dashboard.mockResponses.levels;

      cy.intercept('GET', '**/statistics/dashboard', {
        statusCode: 200,
        body: stats,
      }).as('getDashboardStats');

      cy.intercept('GET', '**/levels', {
        statusCode: 200,
        body: levels,
      }).as('getLevels');
    });
  },
);

Cypress.Commands.add('mockDashboardError', (statusCode = 500, message = 'Server error') => {
  cy.intercept('GET', '**/statistics/dashboard', {
    statusCode: statusCode,
    body: { message: message },
  }).as('getDashboardStatsError');

  cy.intercept('GET', '**/levels', {
    statusCode: statusCode,
    body: { message: message },
  }).as('getLevelsError');
});

Cypress.Commands.add('waitForDashboardLoad', () => {
  cy.wait(['@getDashboardStats', '@getLevels']);
});

Cypress.Commands.add('assertStatCard', (index: number, expectedTitle: string, expectedValue?: string) => {
  cy.get(dashboardPage.statCards)
    .eq(index)
    .then(($card) => {
      cy.wrap($card).scrollIntoView();

      cy.wrap($card).within(() => {
        cy.get(dashboardPage.statCardTitle).should('be.visible');
        if (expectedTitle) {
          cy.get(dashboardPage.statCardTitle).should('contain.text', expectedTitle);
        }
        if (expectedValue) {
          cy.get(dashboardPage.statCardValue).should('contain.text', expectedValue);
        }
      });
    });
});

Cypress.Commands.add('assertPointsAndLevel', (expectedPoints?: number, expectedLevel?: number) => {
  cy.get(dashboardPage.pointsLevelCard).should('be.visible');

  if (expectedPoints !== undefined) {
    const formattedPoints = expectedPoints.toLocaleString();
    cy.get(dashboardPage.totalPoints).should('contain.text', formattedPoints);
  }

  if (expectedLevel !== undefined) {
    cy.get(dashboardPage.currentLevel).should('contain.text', expectedLevel.toString());
  }
});

Cypress.Commands.add('assertMapVisible', () => {
  cy.get(dashboardPage.mapContainer, { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('assertDashboardLoaded', () => {
  cy.get(dashboardPage.dashboardContainer).should('be.visible');
  cy.get(dashboardPage.statCards).should('have.length.at.least', 1);
  cy.get(dashboardPage.pointsLevelCard).scrollIntoView();
  cy.get(dashboardPage.pointsLevelCard).should('be.visible');
});
