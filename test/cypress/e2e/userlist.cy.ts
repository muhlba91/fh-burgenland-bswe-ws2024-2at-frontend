describe('User List', () => {
  const users = [{ id: '1', username: 'testuser1' }]
  const locations = [
    {
      id: '1',
      givenName: 'Home',
      givenLocation: 'Vienna, Austria',
      coordinates: { latitude: 48.2082, longitude: 16.3738, elevation: 151 },
      nearestAirport: 'LOWW',
      nearestAirportCoordinates: { latitude: 48.1102, longitude: 16.5697, elevation: 183 }
    },
    {
      id: '2',
      givenName: 'Office',
      givenLocation: 'San Francisco, USA',
      coordinates: { latitude: 37.7749, longitude: -122.4194, elevation: 16 },
      nearestAirport: 'SFO',
      nearestAirportCoordinates: { latitude: 37.6213, longitude: -122.379, elevation: 13 }
    }
  ]

  beforeEach(() => {
    cy.visit('/')
  })

  it('should show the list of users and the locations', () => {
    cy.intercept('GET', '**/user/', {
      statusCode: 200,
      body: {
        users: users
      }
    }).as('getUsers')

    cy.intercept('GET', '**/1/favorite/', {
      statusCode: 200,
      body: {
        locations: locations
      }
    }).as('getLocations')

    cy.visit('/')
    cy.get('div.q-toolbar > button').click()

    cy.wait('@getUsers')

    const userItems = cy.get('div.user-list > .user-item')
    userItems.should('have.length', 1)
    userItems.first().should('contain', 'testuser1')
    userItems.first().click()

    cy.wait('@getLocations')

    const locationItems = userItems.first().find('div.locations-list > a')
    locationItems.should('have.length', 2)
    locationItems.first().should('contain', 'Home')
    locationItems.first().should('not.contain', 'Office')
    locationItems.first().should('contain', '48.2082°N, 16.3738°E')
  })

  it('should show an error if the users cannot be loaded', () => {
    cy.intercept('GET', '**/user/', {
      statusCode: 500
    }).as('getUsers')

    cy.visit('/')
    cy.get('div.q-toolbar > button').click()

    cy.wait('@getUsers')

    const alert = cy.get('div[role="alert"]')
    alert.should('be.visible')
    alert.find('.text-subtitle2').should('contain', 'Request failed with status code 500')
  })

  it('should show an error if the locations cannot be loaded', () => {
    cy.intercept('GET', '**/user/', {
      statusCode: 200,
      body: {
        users: users
      }
    }).as('getUsers')

    cy.intercept('GET', '**/1/favorite/', {
      statusCode: 404
    }).as('getLocations')

    cy.visit('/')
    cy.get('div.q-toolbar > button').click()

    cy.wait('@getUsers')

    const userItems = cy.get('div.user-list > .user-item')
    userItems.should('have.length', 1)
    userItems.first().should('contain', 'testuser1')
    userItems.first().click()

    cy.wait('@getLocations')

    const alert = cy.get('.locations-list .text-negative')
    alert.should('be.visible')
    alert.should('contain', 'Failed to load locations.')
  })

  // it('should be able to delete a location', () => {
  //   cy.intercept('GET', '**/user/', {
  //     statusCode: 200,
  //     body: {
  //       users: users,
  //     }
  //   }).as('getUsers');

  //   cy.intercept('GET', '**/1/favorite/', {
  //     statusCode: 200,
  //     body: {
  //       locations: locations
  //     }
  //   }).as('getLocations');

  //   cy.intercept('DELETE', '**/1/favorite/1', {
  //     statusCode: 204
  //   }).as('deleteLocation');

  //   cy.visit('/');
  //   cy.get('div.q-toolbar > button').click();

  //   const userItems = cy.get('div.user-list > .user-item');
  //   userItems.should('have.length', 1);
  //   userItems.first().should('contain', 'testuser1');
  //   userItems.first().click();

  //   const locationItems = userItems.first().find('div.locations-list > .q-item');
  //   locationItems.should('have.length', 2);
  //   locationItems.first().should('contain', 'Home');
  //   locationItems.first().should('not.contain', 'Office');
  //   locationItems.first().should('contain', '48.2082°N, 16.3738°E');

  //   locationItems.first().find('button').click();
  //   cy.get('.q-dialog[cy-data="confirm-dialog"]').should('be.visible');
  //   cy.get('.q-dialog .q-card__actions button').eq(1).click();

  //   cy.wait('@getUsers');
  //   cy.wait('@getLocations');
  //   cy.wait('@deleteLocation');
  // });

  it('should be able to create a location', () => {
    cy.intercept('GET', '**/user/', {
      statusCode: 200,
      body: {
        users: users
      }
    }).as('getUsers')

    cy.intercept('GET', '**/1/favorite/', {
      statusCode: 200,
      body: {
        locations: locations
      }
    }).as('getLocations')

    cy.intercept('POST', '**/1/favorite/', {
      statusCode: 201,
      body: locations[0]
    }).as('postLocation')

    cy.visit('/')
    cy.get('div.q-toolbar > button').click()

    cy.wait('@getUsers')

    const userItems = cy.get('div.user-list > .user-item')
    userItems.should('have.length', 1)
    userItems.first().should('contain', 'testuser1')
    userItems.first().click()

    cy.wait('@getLocations')

    const buttons = userItems.first().find('.locations-header button')
    buttons.should('have.length', 2)
    buttons.first().click()

    cy.get('.q-dialog[cy-data="create-location-dialog"]').should('be.visible')
    cy.get('input[aria-label="Location Name"]').type('name')
    cy.get('input[aria-label="Location (City, Country)"]').type('location')
    cy.get('div.q-dialog .q-card__actions button').eq(1).click()

    cy.wait('@postLocation')
  })

  it('should be able to delete a user', () => {
    cy.intercept('GET', '**/user/', {
      statusCode: 200,
      body: {
        users: users
      }
    }).as('getUsers')

    cy.intercept('DELETE', '**/user/1', {
      statusCode: 204
    }).as('deleteUser')

    cy.visit('/')
    cy.get('div.q-toolbar > button').click()

    cy.wait('@getUsers')

    cy.get('div.user-list > .user-item button').first().click()
    cy.get('.q-dialog[cy-data="confirm-dialog"]').should('be.visible')
    cy.get('.q-dialog .q-card__actions button').eq(1).click()

    cy.wait('@deleteUser')
  })

  it('should be able to create a user', () => {
    cy.intercept('GET', '**/user/', {
      statusCode: 200,
      body: {
        users: users
      }
    }).as('getUsers')

    cy.intercept('POST', '**/user/', {
      statusCode: 201,
      body: users[0]
    }).as('postUser')

    cy.visit('/')
    cy.get('div.q-toolbar > button').click()

    cy.wait('@getUsers')

    cy.get('div.q-drawer-container div.q-drawer__content div.q-item__label--header button')
      .first()
      .click()

    cy.get('.q-dialog[cy-data="create-user-dialog"]').should('be.visible')
    cy.get('input[aria-label="Username"]').type('name')
    cy.get('div.q-dialog .q-card__actions button').eq(1).click()

    cy.wait('@postUser')
  })
})

// Workaround for Cypress AE + TS + Vite
// See: https://github.com/quasarframework/quasar-testing/issues/262#issuecomment-1154127497
export {}
