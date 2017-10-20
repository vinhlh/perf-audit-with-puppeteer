const shouldLoadTrackingScriptsAfterOnLoad = [
  () => true,
  () => {
    const { timing } = window.performance
    const loadTime = timing.loadEventEnd - timing.navigationStart

    const tagsAfterOnload = performance
      .getEntriesByType('resource')
      .filter(resource => resource.name.search(/utag\.\d+\.js/) !== -1)
      .filter(resource => resource.responseEnd < loadTime)
      .map(resource => resource.name.match(/utag\.\d+\.js/)[0])

    if (!tagsAfterOnload.length) {
      return
    }

    return {
      text: 'Tealium tags should be loaded *after onload*',
      fields: {
        Tags: tagsAfterOnload.join(', ')
      }
    }
  }
]

const validators = [shouldLoadTrackingScriptsAfterOnLoad]

module.exports = validators
