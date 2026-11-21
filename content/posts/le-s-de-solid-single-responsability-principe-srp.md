---
title: 'Le « S » de SOLID : Single Responsability Principe (SRP)'
date: '2013-05-19'
category: Clean code
categories:
  - Clean code
  - Good practices
  - SOLID
cover: /images/blog/srp1.webp
excerpt: >-
  Si vous développez depuis quelque temps, vous avez forcément déjà entendu
  parler de ce principe, surement le plus connu de SOLID.
---

Si vous développez depuis quelque temps, vous avez forcément déjà entendu parler de ce principe, surement le plus connu de SOLID.

## Définition

**Le principe de responsabilité unique** est un concept phare dans la programmation orientée objet. Il introduit le fait qu’une classe ne doit avoir qu’**une seule responsabilité bien définie**, afin qu’il n’existe qu’**une seule raison pour la modifier**.  
  
Tous les jours, dans son travail, le développeur se confronte à des problèmes plus ou moins complexes. Résoudre les problèmes complexes dans leur globalité est très difficile, tant l’effort intellectuel est intense. La seule solution plausible est de **découper le problème compliqué en problèmes plus simples** à appréhender. Dans cette dynamique, le principe **SRP** veut un découpage parfait, c’est-à-dire que chaque problème simple soit résolu par **une classe à responsabilité unique**.

En appliquant consciencieusement cette pratique, le code devient :

-   Plus facile à lire et à comprendre (moins de couplages)
-   Plus facile à modifier (corriger, étendre)
-   Plus facile à tester (moins de dépendances)
-   Plus robuste

A noter que l’application de SRP ne se fait que dans le cadre du processus de *refactoring* (amélioration) continue du code. Rarement voir jamais au premier jet !

## Un exemple

Souvent, il est facile de trouver plusieurs responsabilités dans **un code long**. Prenons un exemple ici d’un code relativement court : une classe *PersonProvider* qui fournit des données de type *Person*. La méthode *GetValidPersons()* a pour but de retourner les personnes « *valides* » contenue dans une base de données.

```csharp
    public class PersonProvider
    {
        private readonly DatabaseAccess _databaseAccess;

        public PersonProvider()
        {
            _databaseAccess = new DatabaseAccess("localhost", 80, "Login", "Password");
        }

        public IEnumerable<Person> GetValidPersons()
        {
            return (from personne in _databaseAccess.Personnes
                    where personne.Sex == Person.SexType.F
                    where personne.Age > 18
                    select personne).ToList();
        }
    }
```

Cette classe, bien que très simple, est à responsabilités multiples et ne respecte pas le principe SRP. Les fonctionnalités qu’elles assument sont :

-   **Initialiser** un contexte de données
-   **Accéder** à la source de données pour obtenir les personnes
-   **Définir** les conditions de sélection d’une personne « v*alide* »

Si l’on souhaite faire évoluer l’une de ces trois fonctionnalités, nous devons forcément changer la classe *PersonProvider*.

Pour respecter le principe **SRP**, il faut modifier cette classe afin qu’elle soit à responsabilité unique. Par exemple :

```csharp {5,16}
    public class PersonProvider
    {
        private readonly DatabaseAccess _databaseAccess;

        public PersonProvider(DatabaseAccess databaseAccess)
        {
            if (databaseAccess == null) {
                throw new ArgumentNullException("databaseAccess");
            }
            _databaseAccess = databaseAccess;
        }

        public IEnumerable<Person> GetValidPersons()
        {
            return (from personne in _databaseAccess.Personnes
                    where personne.IsValid
                    select personne).ToList();
        }
    }
```

La classe *Person* devient :

```csharp {12}
    public class Person
    {
        public enum SexType { M, F }

        public SexType Sex { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public int Age { get; set; }

        public bool IsValid
        {
            get { return Sex == SexType.F && Age > 18; }
        }
    }
```

  Les modifications apportées sont :

-   La classe obtient le contexte de données à utiliser dans son constructeur. Elle n’a donc plus la responsabilité de l’initialiser.
-   Le code indiquant si une personne est valide ou non, est déplacé dans la classe *Person*.

Dorénavant, la classe *PersonProvider*, n’a plus que la responsabilité d’appliquer des critères de sélection de personnes sur une source de données définie. Le principe **SRP** est respecté.

## Conclusion

Ce principe, bien que simple à comprendre, est surement l’un des principes les plus durs à appliquer. Alors, amis développeurs, courage et persévérez ! Les avantages de SRP sont essentiels au sein d’un logiciel, peu importe sa taille.

Attention cependant au sur-découpage et à l’*over-engineering* ! Cet exemple permet d’illustrer SRP mais il dépend bien sûr du contexte. Il est parfois préférable de laisser un code simple et de ne l’améliorer (*refactoring*) que lorsqu’on rencontre de la duplication.

Prochain poste d’architecture **SOLID**, on continue dans l’ordre : **O pour Open/Closed Principle (OCP)** !
