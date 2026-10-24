/* Redirect legacy /vacancy/{id} and /application/{id} URLs.
   A static host serves the homepage when that folder was not exported.
   The details and application pages always exist and load the job from the API. */
(function () {
  try {
    var path = window.location.pathname.replace(/\/+$/, '')
    var job = path.match(/^\/vacancy\/([^/]+)$/)
    if (job) {
      var id = decodeURIComponent(job[1]).replace(/\.html$/i, '')
      if (id && id !== 'details') {
        window.location.replace('/vacancy/details/?id=' + encodeURIComponent(id))
      }
      return
    }
    var application = path.match(/^\/application\/([^/]+)$/)
    if (application) {
      var applicationId = decodeURIComponent(application[1]).replace(/\.html$/i, '')
      if (applicationId && applicationId !== 'apply') {
        window.location.replace('/application/apply/?id=' + encodeURIComponent(applicationId))
      }
    }
  } catch (e) {}
})()
