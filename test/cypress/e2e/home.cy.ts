describe('Landing Page', () => {
  const users = [
    { id: '1', username: 'testuser1' },
    { id: '2', username: 'testuser2' }
  ]
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

  it('should show the hero-card', () => {
    cy.get('div.hero-card').should('contain', 'Welcome to Weather App')
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
    userItems.should('have.length', 2)
    userItems.first().should('contain', 'testuser1')
    userItems.first().should('not.contain', 'testuser2')
    userItems.first().click()

    cy.wait('@getLocations')

    const locationItems = userItems.first().find('div.locations-list > .q-item')
    locationItems.should('have.length', 2)
    locationItems.first().should('contain', 'Home')
    locationItems.first().should('not.contain', 'Office')
    locationItems.first().should('contain', '48.2082°N, 16.3738°E')
  })
})

// Workaround for Cypress AE + TS + Vite
// See: https://github.com/quasarframework/quasar-testing/issues/262#issuecomment-1154127497
export {}
