"use strict"

const assert = require("assert");
const { setValue } = require('./utils')

var consoleLog;
module.exports = {
  before: function() {
    consoleLog = console.log;
  },
  'Page d\'accueil': function(client) {
    console.log = function() {}; // Ignore the first log.
    client.url("http://localhost:8080")
      .perform(function() {
        console.log = consoleLog;
      })
      .assert.elementPresent('#home-link.active', "Le menu de la page d'accueil est sélectionné.")
      .assert.elementNotPresent('#projects-link.active', "Le menu de la page de projets n'est pas sélectionné.")
      .assert.elementNotPresent('#publications-link.active', "Le menu de la page de publications n'est pas sélectionné.")

    client.expect.element('.jumbotron').text.to.contains('Le laboratoire Semantic IA est un laboratoire de recherche')

    client.expect.elements('.news li').count.to.equal(5)
    client.expect.elements('.news li:nth-child(1) .post-date').text.to.equal('12 décembre 2020')
    client.expect.elements('.news li:nth-child(1) .title').text.to.equal('Prochain séminaire:')
    client.expect.elements('.news li:nth-child(1) .presentator').text.to.equal('')
    client.expect.elements('.news li:nth-child(2) .post-date').text.to.equal('22 décembre 2019')
    client.expect.elements('.news li:nth-child(2) .title').text.to.equal('Prochain séminaire: Déception machine et Hallucinations profondes d\'Érudits: Pourquoi Repère ? Pourquoi maintenant ?')
    client.expect.elements('.news li:nth-child(2) .presentator').text.to.equal('Olivier Spéciel')
    client.expect.elements('.news li:nth-child(2) .date').text.to.equal('jeudi 12 décembre 2019 05:00')
    client.expect.elements('.news li:nth-child(2) .location').text.to.equal('Salle M-1022 au pavillon Lassonde à Polytechnique Montréal')
    client.expect.elements('.news li:nth-child(5) .text .title').text.to.equal('Le travail de Marc Jacques est disponible sur Google Scholar.')
  },
  'Page de projets': function(client) {
    console.log = function() {}; // Ignore the first log.
    client.url("http://localhost:8080/projects")
      .perform(function() {
        console.log = consoleLog;
      })
      .assert.elementNotPresent('#home-link.active', "Le menu de la page d'accueil n'est pas sélectionné.")
      .assert.elementNotPresent('#team-link.active', "Le menu de la page d'équipe n'est pas sélectionné.")
      .assert.elementPresent('#projects-link.active', "Le menu de la page de projets est sélectionné.")
      .assert.elementNotPresent('#publications-link.active', "Le menu de la page de publications n'est pas sélectionné.")
      .waitForUpdate();

    // Projets en cours

    client.expect.element('main h1:nth-of-type(1)').text.to.contain('Projets en cours')

    client.expect.elements('.projects:nth-of-type(1) li').count.to.equal(8)

    client.expect.element('.projects:nth-of-type(1) li:first-child span').text.to.contains('Zack')
    client.expect.element('.projects:nth-of-type(1) li:first-child a')
      .text.to.contains('Apprentissage machine pour la classification de réponses à des questions ouvertes')
    client.expect.element('.projects:nth-of-type(1) li:first-child .meta')
      .text.to.contains('Directeur(e): Michel Deslauriers')
    client.expect.element('.projects:nth-of-type(1) li:first-child .meta')
      .text.to.contains('Co-directeur(e)(s): Zinedine Zidane, Bernard Geoffrion')

    client.expect.element('.projects:nth-of-type(1) li:last-child span').text.to.contains('Damien')
    client.expect.element('.projects:nth-of-type(1) li:last-child a')
      .text.to.contains('Extraction de relations de composition au sein de documents archéologiques')
    client.expect.element('.projects:nth-of-type(1) li:last-child .meta')
      .text.to.contains('Directeur(e): Michel Deslauriers')
    client.expect.element('.projects:nth-of-type(1) li:last-child .meta')
      .text.to.contains('Co-directeur(e)(s): Alphonsine Beauchamnps')

    // Ancien projets

    client.expect.element('main h1:nth-of-type(2)').text.to.contain('Projets passés')

    client.expect.elements('.projects:nth-of-type(2) li').count.to.equal(9)

    client.expect.element('.projects:nth-of-type(2) li:first-child span').text.to.contains('Granella')
    client.expect.element('.projects:nth-of-type(2) li:first-child a')
      .text.to.contains('Extraction de relations sémantiques à partir de descriptions de sites patrimomiaux du Québec')
    client.expect.element('.projects:nth-of-type(2) li:first-child .meta')
      .text.to.contains('Directeur(e): Michel Deslauriers')
    client.expect.element('.projects:nth-of-type(2) li:first-child .meta')
      .text.to.contains('Co-directeur(e)(s): Alphonsine Beauchamnps')

    client.expect.element('.projects:nth-of-type(2) li:last-child span').text.to.contains('Hildège')
    client.expect.element('.projects:nth-of-type(2) li:last-child a')
      .text.to.contains('Système d\'aide à la décision pour le réseau de distribution')
    client.expect.element('.projects:nth-of-type(2) li:last-child .meta')
      .text.to.contains('Directeur(e): Michel Deslauriers')
    client.expect.element('.projects:nth-of-type(2) li:last-child .meta')
      .text.to.contains('Co-directeur(e)(s): Rachid Badouri')

    client.click('.projects:nth-of-type(2) li:nth-child(2) a', function(result) {
      this.expect.element('h1')
        .text.to.equal('Évaluation et amélioration de la qualité de DBpedia pour la représentation de la connaissance du domaine')

      this.expect.element('.meta p:nth-child(1)').text.to.contain('Étudiant: Christophe Deniger')
      this.expect.element('.meta p:nth-child(2)').text.to.contain('Directeur(e): Alphonsine Beauchamps')
      this.expect.element('.meta p:nth-child(3)').text.to.contain('Co-directeur(e)(s): Michel Deslauriers')
      this.expect.element('.description > div p').text.to.contain('L’évolution récente du Web sémantique, tant par la quantité')

      this.expect.elements('.publications tr').count.to.equal(4)
      this.expect.elements('.publications tr:nth-child(1)').text.to.contain('2017')
      this.expect.elements('.publications tr:nth-child(1)').text.to.contain('Janvier')
      this.expect.elements('.publications tr:nth-child(4)').text.to.contain('2015')
      this.expect.elements('.publications tr:nth-child(4)').text.to.contain('Novembre')
    })
  },
  'Page de publications': function(client) {
    console.log = function() {}; // Ignore the first log.
    client.url("http://localhost:8080/publications")
      .perform(function() {
        console.log = consoleLog;
      })
      .assert.elementNotPresent('#home-link.active', "Le menu de la page d'accueil n'est pas sélectionné.")
      .assert.elementNotPresent('#team-link.active', "Le menu de la page d'équipe n'est pas sélectionné.")
      .assert.elementNotPresent('#projects-link.active', "Le menu de la page de projets n'est pas sélectionné.")
      .assert.elementPresent('#publications-link.active', "Le menu de la page de publications est sélectionné.")

    client.expect.element('.modal').to.not.be.visible
    client
      .click('button.trigger', () => {
        client.expect.element('.modal').to.be.visible
        client.elements('css selector', '.author-input', result => {
          assert(result.value.length === 1, "Le nombre de champ d'auteur n'est pas égal à 1.")
        })
        client.click('.add-author i', result => {
          client.elements('css selector', '.author-input', result => {
            assert(result.value.length === 2, "Le nombre de champ d'auteur n'est pas égal à 2.")
          })
        })
        client.click('.add-author i', () => {
          client.elements('css selector', '.author-input', result => {
            assert(result.value.length === 3, "Le nombre de champ d'auteur n'est pas égal à 3.")
          })
        })
        client.click('.remove-author:nth-child(14) i', () => {
          client.elements('css selector', '.author-input', result => {
            assert(result.value.length === 2, "Le nombre de champ d'auteur n'est pas égal à 2.")
          })
        })
      })
      .click('.modal .close-button', () => {
        client.expect.element('.modal').to.not.be.visible
      })

    client.expect.elements('.publications tr').count.to.equal(10)
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('date')
    client.expect.element('#filterAscValueSection').to.have.value.that.equals('desc')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2019')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Janvier')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Mining Concept Map from Text in Portuguese')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Camila Zacche de Aguiar, Davidson Cury, Alphonsine Beauchamps')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Brazilian Journal of Computers in Education 27.01')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2016')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Juillet')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Automatic Extraction of Axioms from Wikipedia Using SPARQL')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Joey Gelinas, Alphonsine Beauchamps, Michel Deslauriers')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('ESWC-16 Open Knowledge Extraction Challenge, Heraklion, Greece')

    // Changement de l'ordre du filtre
    client.click('#filterAscValueSection option[value=asc]')
    client.expect.url().to.contain('order_by=asc');
    client.expect.element('#filterAscValueSection').to.have.value.that.equals('asc')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2011')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2012')

    // Changement du type de filtre
    client.click('#filterAscValueSection option[value=desc]')
    client.expect.url().to.contain('order_by=desc');
    client.click('#fieldFilterSection option[value=title]')
    client.expect.url().to.contain('sort_by=title');
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('title')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2016')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Juillet')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2012')

    client.click('#filterAscValueSection option[value=asc]')
    client.expect.url().to.contain('order_by=asc');
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('title')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2018')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Juillet')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2013')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Michelle')

    // Affichage de la page courante dans la pagination
    client.expect.elements('.pagination .pagination-link').count.to.equal(6)
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(1)', "La fonction page précédente de la pagination est active.")
    client.assert.elementPresent('.pagination .pagination-link.active:nth-child(2)', "La 1re page de la pagination est active.")
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(3)', "La 2re page de la paginationn n'est pas active.")
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(4)', "La 3re page de la pagination n'est pas active.")
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(5)', "La fonction prochaine page de la pagination n'est pas active.")
    client.click('.pagination .pagination-link:nth-child(4)')
    client.expect.url().to.contain('page=3');
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(1)')
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(2)')
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(3)')
    client.assert.elementPresent('.pagination .pagination-link.active:nth-child(4)')
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(5)')
    client.assert.elementNotPresent('.pagination .pagination-link.active:nth-child(6)')
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('title')
    client.expect.element('#filterAscValueSection').to.have.value.that.equals('asc')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2011')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Maurice')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2013')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Michel')

    client.click('.pagination .pagination-link:nth-child(6)')
    client.expect.url().to.contain('page=4');
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('title')
    client.expect.element('#filterAscValueSection').to.have.value.that.equals('asc')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2012')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Maurice')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2016')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Juillet')

    client.click('.pagination .pagination-link:nth-child(6)')
    client.expect.url().to.contain('page=4');

    // Changement du nombre d'éléments par page
    client.expect.element('#elementsPerPageSection').to.have.value.that.equals('10')
    client.click('#elementsPerPageSection option[value="30"]')
    client.expect.url().to.contain('limit=30');
    client.expect.url().to.contain('page=1');
    client.expect.elements('.publications tr').count.to.equal(30)
    client.expect.element('#elementsPerPageSection').to.have.value.that.equals('30')
    client.expect.elements('.pagination .pagination-link').count.to.equal(4)
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('title')
    client.expect.element('#filterAscValueSection').to.have.value.that.equals('asc')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2018')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Juillet')
    client.expect.element('.publications tr:nth-child(30)').text.to.contains('2013')
    client.expect.element('.publications tr:nth-child(30)').text.to.contains('Michel')

    client.click('.pagination .pagination-link:nth-child(3)')
    client.expect.url().to.contain('page=2');
    client.expect.elements('.publications tr').count.to.equal(10)
    client.expect.element('#elementsPerPageSection').to.have.value.that.equals('30')
    client.expect.elements('.pagination .pagination-link').count.to.equal(4)
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('2012')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Maurice')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('2016')
    client.expect.element('.publications tr:nth-child(10)').text.to.contains('Juillet')

    // Suppression de la première publication
    client.click('.pagination .pagination-link:nth-child(2)')
    client.expect.url().to.contain('page=1');
    client.expect.element('.publications tr:first-child .pubtitle').text.to.equal('A Comparison of Features for the Automatic Labeling of Student Answers to Open-Ended Questions')
    client.click('.publications tr:first-child .del-icon i', result => {
      client.expect.element('.publications tr:first-child .pubtitle').text.to.equal('A Machine Learning Filter for the Slot Filling Task')
    })
    // Suppression de la 3ieme publication
    client.expect.element('.publications tr:nth-child(3) .pubtitle').text.to.equal('A disambiguation resource extracted from Wikipedia for semantic annotation')
    client.click('.publications tr:nth-child(3) .del-icon i')
    client.expect.element('.publications tr:nth-child(3) .pubtitle').text.to.equal('A knowledge-base oriented approach for automatic keyword extraction')

    client.click('#fieldFilterSection option[value=date]')
    client.click('#filterAscValueSection option[value=asc]')

    client.click('button.trigger')
    client
      .clearValue('input[name=year]')
      .setValue('input[name=year]', '1950')
      .click('select[name=month] option[value="1"]')
      .clearValue('input[name=title]')
      .setValue('input[name=title]', 'Web sémantique')
      .clearValue('.author-input input')
      .setValue('.author-input input', 'Pierre-Marc')
      .clearValue('input[name=venue]')
      .setValue('input[name=venue]', 'WS Conference')

    client.submitForm('.modal form')
    client.expect.element('#fieldFilterSection').to.have.value.that.equals('date')
    client.expect.element('#filterAscValueSection').to.have.value.that.equals('asc')
    client.assert.elementPresent('.pagination .pagination-link.active:nth-child(2)')
    client.expect.elements('.publications tr').count.to.equal(30)
    client.expect.element('#elementsPerPageSection').to.have.value.that.equals('30')
    client.expect.elements('.pagination .pagination-link').count.to.equal(4)
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('1950')
    client.expect.element('.publications tr:nth-child(1)').text.to.contains('Février')

    client.click('#filterAscValueSection option[value=desc]')
    // client.setValue('#filterAscValueSection', 'desc', result => {})
    client.click('.pagination .pagination-link:nth-child(3)')
    client.expect.elements('.publications tr').count.to.equal(9)

    client.click('button.trigger')
    client
      .clearValue('input[name=year]')
      .setValue('input[name=year]', '1950')
      .setValue('select[name=month]', '12')
      .clearValue('input[name=title]')
      .setValue('input[name=title]', 'Web')
      .clearValue('.author-input input')
      .setValue('.author-input input', 'Pierre-Marc')
      .clearValue('input[name=venue]')
      .setValue('input[name=venue]', 'WS Conference')
    client.submitForm('.modal form')
    client.assert.elementPresent('.errors')
    client.expect.elements('.errors li').count.to.equal(2)

    client.end()
  }
};
