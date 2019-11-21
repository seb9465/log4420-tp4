"use strict"

var consoleLog;
module.exports = {
  before: function() {
    consoleLog = console.log;
  },
  'Page d\'accueil': function(client) {
    console.log = function() {}; // Ignore the first log.
    console.log('Page d\'accueil')
    client.url("http://localhost:8080")
      .perform(function() {
        console.log = consoleLog;
      })
      .assert.elementPresent('#home-link.active', "Le menu de la page d'accueil est sélectionné.")
      .assert.elementNotPresent('#projects-link.active', "Le menu de la page de projets n'est pas sélectionné.")
      .assert.elementNotPresent('#publications-link.active', "Le menu de la page de publications n'est pas sélectionné.")

    client.expect.element('nav li .dropdown .dropdown-content').to.not.be.visible
    client.expect.element('.dropdown-content a:nth-child(1)').to.have.attribute('class').which.contains('active')

    client.expect.element('.jumbotron').text.to.contains('Le laboratoire Semantic IA est un laboratoire de recherche')

    client.expect.elements('.news li').count.to.equal(9)
    client.expect.elements('.news li:nth-child(1) .post-date').text.to.equal('12 décembre 2020')
    client.expect.elements('.news li:nth-child(1) .title').text.to.equal('Prochain séminaire:')
    client.expect.elements('.news li:nth-child(1) .presentator').text.to.equal('')
    client.expect.elements('.news li:nth-child(2) .post-date').text.to.equal('22 décembre 2019')
    client.expect.elements('.news li:nth-child(2) .title').text.to.equal('Prochain séminaire: Déception machine et Hallucinations profondes d\'Érudits: Pourquoi Repère ? Pourquoi maintenant ?')
    client.expect.elements('.news li:nth-child(2) .presentator').text.to.equal('Olivier Spéciel')
    client.expect.elements('.news li:nth-child(2) .date').text.to.equal('jeudi 12 décembre 2019 05:00')
    client.expect.elements('.news li:nth-child(2) .location').text.to.equal('Salle M-1022 au pavillon Lassonde à Polytechnique Montréal')
    client.expect.elements('.news li:nth-child(9) .text .post-date').text.to.equal('12 octobre 2018')
    client.expect.elements('.news li:nth-child(9) .text .title').text.to.equal('')

    client.end()
  }
};
