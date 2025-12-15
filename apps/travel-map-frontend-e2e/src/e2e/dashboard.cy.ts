import '../support/dashboard.commands';
import { dashboardPage } from '../support/dashboard.commands';
import '../support/sign-in.commands';

describe('Dashboard - UI & Mocked API', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.setupAuthMocks();
    cy.fixture('dashboard.json').then((dashboard) => {
      cy.intercept('GET', '**/statistics/dashboard', {
        statusCode: 200,
        body: dashboard.mockResponses.dashboardStats,
      }).as('getDashboardStats');

      cy.intercept('GET', '**/levels', {
        statusCode: 200,
        body: dashboard.mockResponses.levels,
      }).as('getLevels');
    });

    cy.loginUI();
    cy.mockRefreshToken(true);
    cy.visit('/dashboard');
    cy.wait(['@getDashboardStats', '@getLevels']);
  });

  describe('Page Elements', () => {
    it('should display all required dashboard elements', () => {
      cy.assertDashboardLoaded();
      cy.get(dashboardPage.statCards).should('have.length', 7);
      cy.get(dashboardPage.pointsLevelCard).should('be.visible');
    });

    it('should display stat cards with correct structure', () => {
      cy.get(dashboardPage.statCards)
        .first()
        .within(() => {
          cy.get(dashboardPage.statCardIcon).should('be.visible');
          cy.get(dashboardPage.statCardTitle).should('be.visible');
          cy.get(dashboardPage.statCardValue).should('be.visible');
        });
    });

    it('should display points and level card structure', () => {
      cy.get(dashboardPage.pointsLevelCard).scrollIntoView();
      cy.get(dashboardPage.pointsLevelCard).should('be.visible');
      cy.get(dashboardPage.totalPoints).should('be.visible');
      cy.get(dashboardPage.currentLevel).should('be.visible');
      cy.get(dashboardPage.progressBar).should('exist');
    });

    it('should display map when countries are visited', () => {
      cy.get('.leaflet-container', { timeout: 10000 }).should('exist');
      cy.get('.leaflet-container', { timeout: 10000 }).should(($map) => {
        expect($map.height()).to.be.greaterThan(0);
      });
    });
  });

  describe('Stat Cards Content', () => {
    it('should display total trips correctly', () => {
      cy.fixture('dashboard.json').then((dashboard) => {
        cy.assertStatCard(0, '', dashboard.mockResponses.dashboardStats.totalTrips.toString());
      });
    });

    it('should display total distance correctly', () => {
      cy.fixture('dashboard.json').then((dashboard) => {
        const distanceInKm = (dashboard.mockResponses.dashboardStats.totalDistance / 1000).toFixed(2);
        cy.assertStatCard(1, '', distanceInKm);
      });
    });

    it('should display visited countries correctly', () => {
      cy.fixture('dashboard.json').then((dashboard) => {
        cy.assertStatCard(2, '', dashboard.mockResponses.dashboardStats.visitedCountries.toString());
      });
    });

    it('should display visited cities correctly', () => {
      cy.fixture('dashboard.json').then((dashboard) => {
        cy.assertStatCard(3, '', dashboard.mockResponses.dashboardStats.visitedCities.toString());
      });
    });

    it('should display most visited city correctly', () => {
      cy.fixture('dashboard.json').then((dashboard) => {
        cy.assertStatCard(4, '', dashboard.mockResponses.dashboardStats.mostVisitedCity.name);
      });
    });

    it('should display most visited city correctly', () => {
      cy.fixture('dashboard.json').then((dashboard) => {
        cy.assertStatCard(4, '', dashboard.mockResponses.dashboardStats.mostVisitedCity.name);
      });
    });

    it('should display most visited country correctly', () => {
      cy.fixture('dashboard.json').then((dashboard) => {
        cy.assertStatCard(5, '', dashboard.mockResponses.dashboardStats.mostVisitedCountry.name);
      });
    });
  });

  describe('Points and Level', () => {
    it('should display correct points and level', () => {
      cy.fixture('dashboard.json').then((dashboard) => {
        cy.get(dashboardPage.pointsLevelCard).scrollIntoView();
        cy.assertPointsAndLevel(dashboard.mockResponses.dashboardStats.totalPoints, 4);
      });
    });

    it('should display progress to next level', () => {
      cy.get(dashboardPage.progressBar).scrollIntoView();
      cy.get(dashboardPage.progressBar).should('exist');
      cy.get(dashboardPage.progressText).should('exist');
    });

    it('should calculate progress percentage correctly', () => {
      cy.get(dashboardPage.progressBar).scrollIntoView();
      cy.get(dashboardPage.progressBar).should('have.attr', 'style').and('include', 'width');
    });
  });

  describe('Navigation', () => {
    it('should maintain URL on dashboard', () => {
      cy.url().should('include', '/dashboard');
      cy.url().should('not.include', '/auth');
    });

    it('should reload data when page is refreshed', () => {
      cy.reload();
      cy.wait(['@getDashboardStats', '@getLevels']);
      cy.assertDashboardLoaded();
    });
  });
});

// ============================================
// Real API Integration Tests
// ============================================

describe('Dashboard - Real API Integration', { tags: '@integration' }, () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    // Alias login request for loginUI to wait on
    cy.intercept('POST', '**/auth/login').as('loginRequest');

    cy.loginUI();

    cy.url().should('include', '/dashboard', { timeout: 10000 });
  });

  describe('Real Dashboard Data', () => {
    it('should load real dashboard data from API', () => {
      cy.intercept('GET', '**/statistics/dashboard').as('realDashboardStats');
      cy.intercept('GET', '**/levels').as('realLevels');

      cy.reload();

      cy.wait('@realDashboardStats', { timeout: 10000 }).then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body).to.have.property('totalTrips');
        expect(interception.response?.body).to.have.property('totalPoints');
        expect(interception.response?.body).to.have.property('visitedCountries');
      });

      cy.wait('@realLevels').then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body).to.be.an('array');
      });

      cy.assertDashboardLoaded();
    });

    it('should display all stat cards with real data', () => {
      cy.get(dashboardPage.statCards).should('have.length', 7);

      cy.get(dashboardPage.statCards).each(($card) => {
        cy.wrap($card).within(() => {
          cy.get(dashboardPage.statCardValue).should('not.be.empty');
        });
      });
    });

    it('should display real points and level', () => {
      cy.get(dashboardPage.pointsLevelCard).scrollIntoView();
      cy.get(dashboardPage.totalPoints).should('not.be.empty');
      cy.get(dashboardPage.currentLevel).should('not.be.empty');
    });

    it('should handle map display based on real data', () => {
      cy.get(dashboardPage.dashboardContainer).should('be.visible');
    });
  });

  describe('Authorization', () => {
    it('should require authentication to access dashboard', () => {
      cy.clearCookies();
      cy.clearLocalStorage();

      cy.visit('/dashboard');

      cy.url().should('include', '/auth/sign-in', { timeout: 5000 });
    });

    it('should maintain session during dashboard usage', () => {
      cy.reload();

      cy.url().should('include', '/dashboard');
      cy.url().should('not.include', '/auth/sign-in');
    });
  });
});
