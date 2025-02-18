import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../../../../src/pages/IndexPage.vue'
import { Quasar } from 'quasar'

describe('IndexPage.vue', () => {
  const createWrapper = () =>
    mount(IndexPage, {
      global: {
        plugins: [Quasar]
      }
    })

  it('renders hero card with correct content', () => {
    const wrapper = createWrapper()
    const heroCard = wrapper.find('.hero-card')
    expect(heroCard.exists()).toBe(true)
    expect(heroCard.find('.text-h4').text()).toBe('Welcome to Weather App')
    expect(heroCard.find('.text-body1').text()).toContain('Track weather conditions')
  })

  it('renders feature cards for user and location management', () => {
    const wrapper = createWrapper()
    const featureCards = wrapper.findAll('.feature-card')
    expect(featureCards).toHaveLength(2)
    expect(featureCards[0]?.text()).toContain('Managing Users')
    expect(featureCards[1]?.text()).toContain('Managing Locations')
  })

  it('renders weather information card with features', () => {
    const wrapper = createWrapper()
    const weatherCard = wrapper.find('.weather-info-card')
    const weatherFeatures = wrapper.findAll('.weather-feature')
    expect(weatherCard.exists()).toBe(true)
    expect(weatherFeatures).toHaveLength(4)
    expect(weatherFeatures[0]?.text()).toContain('Current Conditions')
    expect(weatherFeatures[1]?.text()).toContain('Hourly Forecast')
    expect(weatherFeatures[2]?.text()).toContain('METAR Data')
    expect(weatherFeatures[3]?.text()).toContain('Live Updates')
  })

  it('displays user management options', () => {
    const wrapper = createWrapper()
    const userFeatureCard = wrapper.findAll('.feature-card').at(0)
    const listItems = userFeatureCard?.findAll('.q-item')
    expect(listItems?.length).toBe(4)
    expect(listItems?.[0]?.text()).toContain('Open sidebar')
    expect(listItems?.[1]?.text()).toContain('Create new users')
    expect(listItems?.[2]?.text()).toContain('Remove existing users')
    expect(listItems?.[3]?.text()).toContain('Refresh user list')
  })

  it('displays location management options', () => {
    const wrapper = createWrapper()
    const locationFeatureCard = wrapper.findAll('.feature-card').at(1)
    const listItems = locationFeatureCard?.findAll('.q-item')
    expect(listItems?.length).toBe(4)
    expect(listItems?.[0]?.text()).toContain('Select a user')
    expect(listItems?.[1]?.text()).toContain('Add new locations')
    expect(listItems?.[2]?.text()).toContain('Remove saved locations')
    expect(listItems?.[3]?.text()).toContain('Refresh location list')
  })

  it('has proper responsive classes', () => {
    const wrapper = createWrapper()
    const featureColumns = wrapper.findAll('.col-12.col-md-6')
    const weatherFeatureColumns = wrapper.findAll('.col-12.col-sm-6.col-md-3')
    expect(featureColumns).toHaveLength(2)
    expect(weatherFeatureColumns).toHaveLength(4)
  })
})
