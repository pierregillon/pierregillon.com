---
title: Comment modifier du code spaghetti ? Méthode ETRA
date: '2014-05-29T11:23:00'
category: Clean code
categories:
  - Clean code
  - Good practices
  - Refactoring
cover: /images/blog/immo-wegmann-qnr-joo2-4eq-unsplash.webp
excerpt: >-
  En tant que prestataire, vous êtes-vous déjà retrouvé chez un client pour
  assurer de la TMA (Tierce Maintenance Applicative) sur un projet existant
  depuis plus de 3 ans, et n’appliquant aucune des bonnes pratiques de
  développement et de test ? Sûrement. Dans ce cas, vous a-t-on demandé de faire
  des évolutions ou des corrections de
---

En tant que prestataire, vous êtes-vous déjà retrouvé chez un client pour assurer de la TMA (*Tierce Maintenance Applicative*) sur un projet existant depuis plus de 3 ans, et n’appliquant aucune des bonnes pratiques de développement et de test ? Sûrement. Dans ce cas, vous a-t-on demandé de faire des évolutions ou des corrections de bugs sur du code non professionnel (code spaghetti) et non testé ?

Dans ce cas, qu’avez-vous fait ? Avez-vous :

- **Accepté** et modifié le code sans rechigner :  « C’est temporaire avant d’attendre (de vendre) une refonte complète »
- **Refusé** : « Je ne suis pas là pour faire du code de mauvaise qualité »

## Expérience

Il y a quelques mois, la question s’est posée pour moi. Je suis intervenu sur une application critique, en architecture client/serveur. Coté serveur, au cœur de l’application, j’ai découvert une classe de **13 000 lignes** de VB.NET avec **280 méthodes publiques**, concentrant de la logique métier, du requêtage de base de données (en clair), ainsi que des règles de validation.<br />
Imaginez le degré de risque lorsque l’on m’a demandé de modifier des règles métiers centrales de l’application dans une méthode de cette classe de **800 lignes**. Tout ça, sans **le moindre test**. Ofc.

Si j’avais accepté de faire la modification comme l’entreprise le souhaitait, les conséquences auraient été multiple:

- Risque très élevé d’introduction de régression
- Des journées de réflexion intense pour quelques lignes modifiées (projection mentale pour essayer d’anticiper les éventuelles régressions)
- Si le moindre bug survient en production, à qui la faute ? BIBI !

Bien sûr, à part faire des préconisations d’amélioration de code, voire de refonte totale ou partielle, le contrat forfaitaire m’empêchait de refuser d’intervenir sur cette fonctionnalité. J’ai donc décidé de faire les choses autrement.

## Un code non testé, une peur de la régression

Le problème du code non testé est multiple :

1. **Rigidité**. Lors de la modification de code, il est difficile voire impossible d’en détecter les régressions. La stratégie souvent adoptée est d’ajouter des fonctionnalités en touchant le moins de choses possibles. Une fois que cela marche, on ne touche plus à rien !
2. **Complexité.** La conséquence directe de la rigidité, c’est la complexité. On empile les choses les unes sur les autres sans jamais prendre le temps de nettoyer et d’améliorer le code (*refactoring*). Cette complexité va donc en grandissant et la qualité en diminuant.
3. **Mauvaise architecture**. Mettre en place de la testabilité sur un projet nécessite de penser en amont une architecture adaptée. L’idée maîtresse est le **faible couplage**. Sans tests et malgré une conception initiale correcte, l’architecture dérive très vite vers un énorme plat de spaghettis, composé de classes statiques, de singletons et d’objets à multiples responsabilités.

Intervenir sur un tel code est donc **risqué**.

En tant que prestataire ou indépendant, vous avez une image à défendre. Il est donc indispensable de trouver un moyen à court terme de garantir que l’ajout de fonctionnalité n’introduira aucune régression, car la refonte totale ou partielle est souvent une option non viable (refusée par le client).

## La méthodologie ETRA (*Extract, Test, Refactor, Add*)

<figure>
  <a href="/images/blog/mtra.webp"><img src="/images/blog/mtra.webp" alt="" width="800" height="365" /></a>
</figure>

Le méthodologie est basée sur le principe suivant :

> « *On ne doit modifier du code que si l’on peut en mesurer précisément les régressions.*« 

Les tests automatisés sont un moyen de contrôler cette régression. On ne peut modifier du code que s’il est **testé**. Il faut donc commencer par tester le code avant d’effectuer quelconques modifications. Mais qu’en est-il du code dit non testable car possédant de forts couplages ? Comment le rendre testable sans introduire de régression ?

### Le « E » de ETRA : *Extract*

<figure class="align-right">
  <img src="/images/blog/extract.webp" alt="" width="210" height="243" />
</figure>

La première étape est de déplacer le code que l’on souhaite tester, dans un environnement propice aux tests, c’est à dire le plus souvent, dans une nouvelle classe. On procède donc comme suit :

1. **Identifier** la portion de code à modifier
2. **Extraire ce code** dans une nouvelle méthode d’une nouvelle classe
3. **Ajouter les dépendances** de ce code en tant que paramètres de la méthode ou du constructeur
4. **Utiliser** cette classe dans le code appelant

C’est l’étape la plus risquée car on effectue un déplacement de code depuis un environnement non testé. Il faut donc pouvoir garantir intellectuellement (à défaut de pouvoir faire mieux) qu’aucune régression n’a été introduite. Cette étape ne doit comporter aucune modification du comportement de l’application : même si on déplace du code, on doit le conserver tel qu’il a été écrit initialement.

### Le « T » de ETRA : *Test*

<figure class="align-right">
  <img src="/images/blog/test.webp" alt="" width="200" height="244" />
</figure>

La seconde étape consiste à tester le code déplacé afin d’en contrôler les régressions possibles. Dans un premier temps, il faut contrôler les paramètres de la méthode afin de vérifier qu’ils sont instanciables dans un contexte de tests unitaires. Si ce n’est pas le cas, il faut créer **une abstraction du concept via une interface**. En mettant en place ces abstractions, vous rendez le code moins dépendant à des objets d’infrastructure, de requêtage, de service, etc.

Lors de l’écriture de vos tests unitaires, vous devez créer de nouvelles implémentations de ces abstractions pour simuler des comportements bien définis. Vous pourrez alors vous concentrer sur l’essence du code et vérifier qu’il fonctionne, indépendamment des dépendances externes.

Une fois que vous pouvez *mocker* les dépendances de votre code, vous pouvez le tester. Il faut :

1. Ajouter des tests à petite responsabilité
2. Étendre la couverture de test du code déplacé qui doit s’approcher des 100% 

Cet ajout de testabilité est essentiel pour :

- Contrôler la non régression de l’existant
- Donner une meilleure vision du périmètre métier traité par le code
- D’anticiper l’étape suivante : le *refactor*

### Le « R » de ETRA : *Refactor*

<figure class="align-right">
  <img src="/images/blog/refactor.webp" alt="" width="200" height="238" />
</figure>

La troisième étape est d’effectuer un *refactor* du code existant. Dans une application qui a plusieurs années, où un certain nombre de prestataires se sont succédés, le code est souvent complexe voir illisible, car écrit par plusieurs personnes ayant chacun son style de programmation.

Modifier directement ce code est souvent beaucoup plus coûteux que d’effectuer d’abord une réécriture complète ou partielle puis d’effectuer la modification. La couverture de tests de l’étape précédente permet d’effectuer cette étape avec sérénité.<br />

### Le « A » de ETRA : Add

<figure class="align-right">
  <img src="/images/blog/add.webp" alt="" width="205" height="241" />
</figure>

La dernière étape consiste en l’ajout de la fonctionnalité. Grâce à l’ajout de testabilité et au *refactor*, on peut traiter cette étape très efficacement. **Le risque** lié à la modification du code devient quasiment nul car les régressions sont détectées instantanément. Afin de conserver une testabilité optimale, il est conseillé d’effectuer cet ajout en test-first ou TDD (*Test Driven Development*).

## C’est parti pour un exemple !

Pour illustrer la méthode ETRA, voici ci-dessous, un exemple de code très proche de ce que j’ai pu rencontrer lors d’une mission. Je l’ai tout de même simplifié pour qui soit plus compréhensible.

```csharp
    public class GodClass
    {
        private readonly DatabaseAccess _databaseAccess;

        public void DoWork()
        {
            // ...
            // 300 lines of code before
            // ...
            if (_databaseAccess.Connect()) {
                var persons = _databaseAccess.GetPersons();
                var major = 0;
                var l_atLeast1CityLondon = false;
                var paris = 0;
                var maj_male = 0;
                var nb_person = 0;
                var averrageMajAndMale = 0;
                foreach (var person in persons) {
                    if (person.Age >= 18) {
                        major += 1;
                        if (person.Gender == 'M') {
                            maj_male = maj_male + 1;
                        }
                    }
                    nb_person += 1;
                    var l_addresses = FindAddressesForPerson(person);
                    if (l_addresses.Count() > 0) {
                        foreach (var address in l_addresses) {
                            if (address.City == "Paris") {
                                paris = paris + 1;
                            }
                            if (address.City == "London") {
                                l_atLeast1CityLondon = true;
                            }
                        }
                    }
                }
                if (l_atLeast1CityLondon) {
                    DoSomethingStrange();
                }
                averrageMajAndMale = maj_male/nb_person;
                _databaseAccess.SaveDatas(major, averrageMajAndMale, paris);
            }
            // ...
            // 200 lines of code after
            // ...
        }
    }
```

On remarque que ce code est très peu lisible avec plusieurs styles de programmation (nommage de variables). Néanmoins, on comprend à peu près qu’il a pour but de calculer des indicateurs basés sur des objets de type *Person* et *Address*. La méthode *FindAddressesForPerson* est interne à la classe *GodClass*.

Si on vous demandait de modifier ce code pour ajouter une nouvelle fonctionnalité : calculer la moyenne d’âge des personnes vivants à Londres ; comment feriez-vous ? 😀

### Etape 1 : *Extract*

La première étape consiste à extraire le code responsable du calcul des indicateurs dans une classe à part. On appelle ensuite cette classe dans notre fameuse *GodClass*.

```csharp {17}
    public class GodClass
    {
        private readonly DatabaseAccess _databaseAccess;

        public void DoWork()
        {
            // ...
            // 300 lines of code before
            // ...
            if (_databaseAccess.Connect()) {
                var persons = _databaseAccess.GetPersons();
                var major = 0;
                var l_atLeast1CityLondon = false;
                var paris = 0;
                var averrageMajAndMale = 0;

                var indicatorCalculator = new IndicatorCalculator();
                indicatorCalculator.Calculate(
                    persons,
                    ref major,
                    ref averrageMajAndMale,
                    ref paris,
                    ref l_atLeast1CityLondon,
                    FindAddressesForPerson);

                if (l_atLeast1CityLondon) {
                    DoSomethingStrange();
                }
                _databaseAccess.SaveDatas(major, averrageMajAndMale, paris);
            }
            // ...
            // 200 lines of code after
            // ...
        }
    }
```

La nouvelle classe créée se définit de la manière suivante :

```csharp
    public class IndicatorCalculator
    {
        public void Calculate(
            IEnumerable<Person> persons,
            ref int major,
            ref int averrageMajAndMale,
            ref int paris,
            ref bool l_atLeast1CityLondon,
            Func<Person, IEnumerable<Address>> findAddressesForPerson)
        {
            var maj_male = 0;
            var nb_person = 0;
            foreach (var person in persons) {
                if (person.Age >= 18) {
                    major += 1;
                    if (person.Gender == 'M') {
                        maj_male = maj_male + 1;
                    }
                }
                nb_person += 1;
                var l_addresses = findAddressesForPerson(person);
                if (l_addresses.Count() > 0) {
                    foreach (var address in l_addresses) {
                        if (address.City == "Paris") {
                            paris = paris + 1;
                        }
                        if (address.City == "London") {
                            l_atLeast1CityLondon = true;
                        }
                    }
                }
            }
            averrageMajAndMale = maj_male / nb_person;
        }
    }
```

**BERK quelle méthode** ! L’idée principale de cette extraction, est de modifier **le moins de code possible**. La classe *GodClass* n’étant pas testée, il faut conserver la logique du code au maximum pour ne pas introduire de régression.

Nous définissons ici une nouvelle classe responsable du calcul des indicateurs : *IndicatorCalculator*. La méthode *Calculate()* prend en paramètre toutes les dépendances, que ce soit les paramètres de sortie en référence, ou une signature de la fonction *FindAddressesForPerson*. Cette classe est maintenant testable.<br />

### Etape 2 : *Test*

L’objectif ici est de tester la classe *IndicatorCalculator* afin de pouvoir détecter toute régression future. A cette étape, nous ne sommes pas là pour détecter une quelconque anomalie métier dans le code existant. Nous devons considérer le code comme étant valide et créer une bonne couverture de tests. Un exemple de test pourrait être :

```csharp
    [TestMethod]
    public void OnePersonMaleMajorWithOneAddressInParisGiveCorrectIndicators()
    {
        // Datas
        var person = new Person{Age = 18, Gender = 'M'};
        var addresse = new Address {City = "Paris"};
        var personMajorCount = 0;
        var anyLondonCity = false;
        var personLivingInParisCount = 0;
        var personMajorAndMaleAverrage = 0;
        var getAddressFunc =
            new Func<Person, IEnumerable<Address>>(p => new[]{addresse});

        // Actors
        var indicatorCalculator = new IndicatorCalculator();

        // Actions
        indicatorCalculator.Calculate(
            new[] { person }, 
            ref personMajorCount, 
            ref personMajorAndMaleAverrage, 
            ref personLivingInParisCount, 
            ref anyLondonCity, 
            getAddressFunc);

        // Asserts
        Assert.AreEqual(1, personMajorCount);
        Assert.IsFalse(anyLondonCity);
        Assert.AreEqual(1, personLivingInParisCount);
        Assert.AreEqual(1, personMajorAndMaleAverrage);
    }
```

Ce test n’est pas très propre, mais quand bien même, il permet de contrôler le comportement de la classe *IndicatorCalculator*.

Une fois le code testé à quasiment 100%, nous pouvons nous retrousser les manches pour entamer le *Refactor*.<br />

### Etape 3 : *Refactor*

Pour effectuer cette étape, il est intéressant de réfléchir à partir des tests. Ils constituent un des points d’entrée vers la classe *IndicatorCalculator*. Comment pouvons-nous modifier la classe pour qu’elle soit **beaucoup plus élégante et simple à utiliser** ? Passer des références à une méthode n’est pas très propre. Il est préférable de créer un objet *Indicators* regroupant l’ensemble des valeurs calculées. De plus, il est grand temps d’uniformiser les noms de variables par des choses un peu plus parlantes :  

```csharp
    public class Indicators
    {
        public int PersonMajorCount { get; set; }
        public int PersonMajorAndMaleAverrage { get; set; }
        public int PersonLivingInParisCount { get; set; }
        public bool AnyPersonLivingInLondon { get; set; }
    }
```

La méthode *FindAddressesForPerson*, passée sous forme de délégué à la classe *IndicatorProcessor* n’est pas non plus une façon très élégante de procéder. On peut considérer l’ajout d’une interface de type *IAddressLocator* possédant cette fameuse méthode. Cette dépendance est ensuite fournie pour construire l’objet *IndicatorProcessor*.

```csharp
    public interface IAddressLocator
    {
        IEnumerable<Address> FindAddressesForPerson(Person person);
    }
```

L’interface *IAddressLocator* doit donc être *mockée* pour notre test. Une implémentation pourrait être :

```csharp
    private class MockAddressLocator : IAddressLocator
    {
        private readonly Func<Person, Address[]> _getAddressFunc;

        public MockAddressLocator(Func<Person, Address[]> getAddressFunc)
        {
            _getAddressFunc = getAddressFunc;
        }
        public IEnumerable<Address> FindAddressesForPerson(Person person)
        {
            return _getAddressFunc(person);
        }
    }
```

On peut aussi utiliser des librairies de tests comme *[NSubstitute](https://nsubstitute.github.io/)* ou *[Moq](https://github.com/Moq/moq)*, qui permettent de configurer les *mocks* sans créer de nouvelles classes.

On peut dorénavant l’utiliser dans notre test. Il devient :

```csharp
    [TestMethod]
    public void OnePersonMaleMajorWithOneAddressInParisGiveCorrectIndicators()
    {
        // Datas
        var person = new Person { Age = 18, Gender = 'M' };
        var addresse = new Address { City = "Paris" };

        // Actors
        var addressLocator = new MockAddressLocator(p => new[] {addresse});
        var indicatorsCalculator = new IndicatorCalculator(addressLocator);

        // Actions
        var indicators = indicatorsCalculator.Calculate(new[] { person });

        // Asserts
        Assert.AreEqual(1, indicators.PersonMajorCount);
        Assert.IsFalse(indicators.AnyPersonLivingInLondon);
        Assert.AreEqual(1, indicators.PersonLivingInParisCount);
        Assert.AreEqual(1, indicators.PersonMajorAndMaleAverrage);
    }
```

Le test est dorénavant beaucoup plus lisible. Nous pouvons maintenant modifier le code de la classe *IndicatorCalculator* pour qu’il corresponde à notre test.

Il existe plusieurs manières d’effectuer ce *refactor*, et cela, **en fonction du contexte du code**. J’ai choisi de privilégier la lisibilité du code avec LINQ, au détriment des performances car je pars du principe que la liste de personnes et d’adresses seront faibles (<10000 éléments). On obtient :

```csharp
    public class IndicatorCalculator
    {
        private readonly IAddressLocator _addressLocator;

        public IndicatorCalculator(IAddressLocator addressLocator)
        {
            _addressLocator = addressLocator;
        }

        public Indicators Calculate(IEnumerable<Person> persons)
        {
            var localPersons = persons.ToList();
            var indicators = new Indicators();
            indicators.PersonMajorCount = localPersons.Count(person => person.Age >= 18);
            indicators.PersonMajorAndMaleAverrage = localPersons.Count(person => person.Age >= 18 && person.Gender == 'M')/localPersons.Count();
            UpdateAddressIndicators(localPersons, indicators);
            return indicators;
        }

        private void UpdateAddressIndicators(IEnumerable<Person> persons, Indicators indicators)
        {
            var allAddresses = persons.SelectMany(_addressLocator.FindAddressesForPerson).ToList();
            indicators.AnyPersonLivingInLondon = allAddresses.Any(address => address.City == "London");
            indicators.PersonLivingInParisCount = allAddresses.Count(address => address.City == "London");
        }
    }
```

Enfin, la classe *GodClass* devient :

```csharp
    public class GodClass : IAddressLocator
    {
        private readonly DatabaseAccess _databaseAccess;

        public void DoWork()
        {
            // ...
            // 300 lines of code before
            // ...
            if (_databaseAccess.Connect()) {
                var persons = _databaseAccess.GetPersons();
                var indicatorCalculator = new IndicatorCalculator(this);
                var indicators = indicatorCalculator.Calculate(persons);
                if (indicators.AnyPersonLivingInLondon) {
                    DoSomethingStrange();
                }
                _databaseAccess.SaveDatas(
                    indicators.PersonMajorCount,
                    indicators.PersonMajorAndMaleAverrage,
                    indicators.PersonLivingInParisCount);
            }
            // ...
            // 200 lines of code after
            // ...
        }
    }
```

### Etape 4 : *Add*

La dernière étape consiste à ajouter la fonctionnalité souhaitée. Dans notre exemple : **calculer la moyenne d’âge des personnes vivants à Londres**. Cela nécessite de modifier uniquement la méthode *UpdateAddressIndicators* de la classe *IndicatorProcessor* et d’ajouter la propriété dans l’objet *Indicators*. Un exemple de code pourrait être :

```csharp
    private void UpdateAddressIndicators(IEnumerable<Person> localPersons, Indicators indicators)
    {
        var personLivingInLondonAges = new List<int>();
        foreach (var person in localPersons) {
            var addresses = _addressLocator.FindAddressesForPerson(person).ToList();
            if (addresses.Any(address => address.City == "Paris")) {
                indicators.PersonLivingInParisCount++;
            }
            if (addresses.Any(address => address.City == "London")) {
                indicators.AnyPersonLivingInLondon = true;
                personLivingInLondonAges.Add(person.Age);
            }
        }
        if (personLivingInLondonAges.Any()) {
            indicators.PersonLivingInLondonAgeAverrage = personLivingInLondonAges.Average();
        }
    }
```

## Conclusion

Travailler sur un projet où aucune des bonnes pratiques de développement ou de tests n’a été mise en place n’a rien de plaisant. On a tous tendances à critiquer le code, râler, dire qu’on est obligé de mal coder, etc.

Mais finalement, coder proprement n’est qu’une question de choix personnel et de motivation. Peu importe l’environnement, il y a **toujours** des choses que l’on peut mettre en place afin d’**augmenter la qualité générale du projet**.

ETRA est un processus de développement centré sur la sécurisation du code avant toute modification. Elle peut être coûteuse en fonction des projets, mais le gain est très important. Le *refactor* progressif augmente petit à petit la qualité générale du projet tandis que la testabilité donne de plus en plus de visibilité sur les régressions éventuelles liées à l’ajout / modification de fonctionnalités.

Une question reste en suspend : comment vendre cette méthodologie à un client ? Lui faire comprendre que l’on souhaite travailler de cette manière ? Je recommande simplement **de ne pas en parler !** Cette méthodologie de développement ne concerne que nous, développeur.

La seule chose à expliquer concerne le fait que le coût de développement sera de toute façon plus important que sur un projet dit « classique » (à définir) car **les risques** de régression liés à la modification de code dans cet environnement instable sont très élevés. Un simple audit de code permettra de donner cette vision au client.

Et maintenant, à vos claviers !
