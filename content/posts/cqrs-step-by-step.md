---
title: Comment migrer progressivement vers une architecture CQRS ?
date: '2019-08-23T14:42:22'
category: Architecture
categories:
  - Architecture
  - Good practices
cover: /images/blog/cqrs-stairs.webp
excerpt: >-
  L’architecture CQRS n’est pas forcément aisée à mettre en place sur un projet
  déjà existant, notamment car les concepts qu’elle induit sont très différents
  des architectures traditionnelles. Dans cet article, nous verrons comment
  implémenter progressivement le pattern d’architecture CQRS sur une application
  existante. Nous ne nous focaliserons pas sur un langage en particulier, mais
  sur
---

L’architecture CQRS n’est pas forcément aisée à mettre en place sur un projet déjà existant, notamment car les concepts qu’elle induit sont très différents des architectures traditionnelles.

Dans cet article, nous verrons comment implémenter progressivement le pattern d’architecture CQRS sur une application existante. Nous ne nous focaliserons pas sur un langage en particulier, mais sur les concepts et l’architecture logicielle en générale.

Nous parlerons principalement de structure logique du code, et non de l’infrastructure en particulier.

## CQRS

*Command Query Responsability Segregation* (CQRS) est un pattern d’architecture ré-inventé par Greg Young, il y a une bonne dizaine d’année. « *Ré-inventé* » car lui-même indique que ce pattern existait bien avant. Il l’a plutôt remis à l’ordre du jour, dans le contexte d’architectures modernes.

Ce pattern consiste a **séparer** les opérations d’écriture que l’on appelle commande (*Command*) des opérations de lecture, que l’on appelle requête (*Query*).

Les commandes sont **des actions** (définies par un verbe) **que l’on exécute dans le système** et qui en modifie l’état. Exemple :

- <u>Enregistrer</u> un nouvel utilisateur
- <u>Supprimer</u> un produit
- <u>Invalider</u> une commande
- …

Les requêtes, quant à elles, sont **des lectures de l’état du système**, elles n’en modifient pas l’état et sont le plus souvent à des données à afficher à l’utilisateur ou à fournir à un consommateur. Exemple :

- La liste des derniers produits ajoutés
- Le top 20 des meilleurs clients
- La liste des examens groupés par patients non affiliés à un organisme
- …

CQRS met en avant le fait que les responsabilités de lecture et d’écriture sont très différentes et qu’il faut donc **les séparer logiquement et physiquement**.

## Architecture logicielle standard : 3 *layers*

Voici un exemple simplifié de la structure d’une Web API REST dans une architecture classique 3 *layers* :

<figure class="align-center">
  <img src="/images/blog/cqrs-application-n-layers-2.webp" alt="" width="443" height="514" />
  <figcaption>Architecture classique 3 couches logicielles : commandes et requêtes sont traitées de la même manière</figcaption>
</figure>

<div class="callout" style="background-color:#eaf9ff">

**Note** : ce schéma ne représente pas les liens de dépendances entre les différentes couches logicielles. Ce peut être une organisation Hexagonale / Onion avec de l’injection de dépendances ou moins conventionnelle.

</div>

En schématisant, ils y a 3 couches logicielles principales :

- *Presentation Layer* : la couche façade du système qui gère le protocole d’échange.
- *Domain Layer* : la couche qui contient toute la logique métier, à travers des modèles.
- *Data Layer* : la couche de persistance des données

Les commandes et les requêtes, non différenciées, passent par la couche présentation qui implémente le protocole de communication (ici REST), puis par la couche métier qui contient les règles métiers (contenu dans des modèles) et enfin par la couche base de données qui contient les classes requêtant la base de données (ORM ou non).

Plusieurs critiques de cette approche peuvent justifie de migrer en CQRS :

- Les requêtes de données passent par la couche métier et utilisent les modèles métier alors que **ces requêtes n’évaluent** (le plus souvent) **aucun invariant métier**.
- **Les modèles métier voit leur structure modifiée** (*domain corrupted*) en fonction des besoins d’affichage (de requêtage) de données. On obtient ainsi des objets inconsistents, très complexes, avec des champs optionnels en fonction du besoin que l’on en a.
- Les commandes et les requêtes sont traitées à égales alors que dans la plupart des applications, **la lecture a lieu bien plus souvent que l’écriture**. (Afficher les données d’un produit est souvent une requête bien plus fréquente que la modification d’un produit).
- Les commandes et les requêtes utilisent **le même ORM** qui peut ajouter de la complexité non nécessaire pour l’un ou pour l’autre, voir même dégrader les performances de la lecture (chargement de toute la base pour calculer un écran complexe).
- La lecture et l’écriture utilise **la même base de données**, spécialisée pour l’une ou pour l’autre, mais jamais performante pour les deux. Impossible d’obtenir les meilleures performances (dans le cas où on en aurait besoin, ce qui est rare, mais nécessite néanmoins qu’on le souligne).

Voyons maintenant comment migrer cette architecture progressivement en CQRS.

## Séparation de l’écriture et de la lecture

### 1\. CQS : modèle de lecture != modèle d’écriture

La première étape consiste à séparer les modèles de lecture et d’écriture, en fonction du type d’action (commande ou requête) envoyée dans le système.

Lorsqu’on **exécute une commande** (*Command*), on a nécessairement besoin de modéliser un domaine pour intégrer des invariants métiers. Ce sont les modèles d’écriture : Produit, Utilisateur, Panier, … Ces modèles se situent dans la couche logique métier « *Business Layer* » et sont instancier et manipuler lors de l’exécution d’une commande.

En ce qui concerne **la requête de données** (*Query*), la plupart n’utilisent aucune règle métier et n’ont donc pas besoin de passer par la couche « *Domain Layer*« . Les modèles de lecture (appelé *ReadModel* ou *Data Transfert Object* (DTO)) ListDeProduit, PaniersGroupéParUtilisateur, … sont présents dans la couche « *Presentation Layer*« . Plus aucun appel ne passe par la couche métier mais directement par la couche de données « Data Layer ». Ce peut être la même couche que pour l’écriture ou une couche différente avec par exemple un ORM différent (*[Dapper](https://github.com/StackExchange/Dapper)* over *[EntityFramework](https://www.entityframeworktutorial.net/)*).

<figure class="align-center">
  <img src="/images/blog/cqrs-two-db-layers-1.webp" alt="" width="488" height="566" />
</figure>

**Avantages** :

- Plus de couplage entre de la lecture simple de données et des modèles métiers remplis de comportements
- Les modèles de lecture (DTO) sont conçus directement en fonction des besoins d’affichage et remplis directement par la base de données.
- Les modèles d’écriture peuvent dorénavant être structurés de manière totalement différents des modèles de lecture.
- Possibilité d’utiliser des ORM différents, optimisés pour l’écriture vs pour la lecture (exemple: *[Dapper](https://github.com/StackExchange/Dapper)* over *[EntityFramework](https://www.entityframeworktutorial.net/)*)

**Inconvénients** :

- Nécessite de nouvelles manières de coder qu’il faut apprendre (plusieurs modèles par usage)

<div class="callout" style="background-color:#eaf9ff">

**Note** : il est tout à fait possible d’avoir des règles métier spécifique à la lecture. Dans ce cas, on peut créer des objets métiers dédiés avec cette logique qui sont réhydrater par la base de données uniquement lors de la lecture.

</div>

### 2\. Deux applications distinctes

La seconde étape consiste à séparer la lecture et l’écriture dans deux applications distinctes, pour notre exemple, 2 web API. Pour cela, on extrait tous les modèles de lecture et la couche de données dans une autre API. On obtient donc 2 APIs : une API dédiée à l’écriture et l’autre dédiée à la lecture.

<figure class="align-center">
  <img src="/images/blog/cqrs-two-applications-1.webp" alt="" width="471" height="547" />
</figure>

**Avantages** :

- Chaque application possède un but précis : lecture ou écriture. On a donc du code de même paradigme au même endroit, ce qui facile la maintenance.
- On peut versionner et faire évoluer les applications de manière indépendante.
- On peut adapter le nombre d’instance de chaque application en fonction des besoins. Exemple, pour un site e-commerce qui fait énormément de lecture (recherche de produits, affichage des détails d’un produit, etc.), on peut avoir 1 seule instance d’API d’écriture et 4 ou 5 instances de lecture.

<figure class="align-center">
  <img src="/images/blog/cqrs-load-balancing.webp" alt="" width="517" height="600" />
  <figcaption>CQRS : une API dédiée à l’écriture (2 instances) et une API dédiée à la lecture (5 instances)</figcaption>
</figure>

- On peut créer de nouvelles API de lecture spécialisées pour un support particulier. Exemple, on crée une application mobile, on peut créer en face une nouvelle API spécialisée pour le mobile (si les écrans sont très différents de l’application d’origine). On réutilise par contre l’API d’écriture : c’est elle qui contient **toutes les règles métiers**.

<figure class="align-center">
  <img src="/images/blog/cqrs-multiple-read-side.webp" alt="" width="441" height="512" />
  <figcaption>CQRS : une API de lecture dédiée à chaque client (Mobile et Site Web) et une API en écriture commune</figcaption>
</figure>

**Inconvénients** :

- Séparer en 2 applications posent la question de l’ownership de la base de données.
- Il faut être certains que les modifications de la base de données ne sont pas cassants (breaking changes) car il faut impérativement mettre à jour le code des 2 applications.

### 3\. Deux bases de données

Enfin, la dernière étape consiste à spécialiser les bases de données de chaque API. Il n’existe pas de base de données parfaite. Chacune possède ses spécificités, ses avantages et ses inconvénients. Ici, on choisit une base de données optimisés en écriture avec une gestion de l’intégrité des données (exemple: SQL relationnel comme SQL Server, Oracle, mysql, postgresql, …) pour l’API d’écriture, et une base de données optimisées en lecture (exemple: base dénormalisée type [*ElasticSearch*](https://www.elastic.co/fr/products/elasticsearch)) pour la lecture.

La base de référence (maître) est la base d’écriture alors que la base de lecture est une base secondaire (redondance).

Cela nécessite néanmoins d’avoir un « *batch* » de synchronisation des données de la base d’écriture vers la base de lecture. Sans rentrer dans les détails, cela peut se faire par *Bus*, pour notifier le changement d’état.

<figure class="align-center">
  <img src="/images/blog/cqrs-two-db-2.webp" alt="" width="450" height="522" />
</figure>

<div class="callout" style="background-color:#e8f5fa">

A noter que cela introduit ce que l’on appelle de l’[Eventual Consistency](https://en.wikipedia.org/wiki/Eventual_consistency), c’est à dire une latence de mise à jour entre les deux bases de données (et donc entre les deux applications). Si l’on exécute une requête juste après la fin d’une commande, on ne garantit pas que la donnée sera à jour *immédiatement*, mais elle le sera dans un temps *satisfaisant*.

</div>

**Avantages**

- Des bases adaptées à chaque besoin, donc des performances **optimales**.

**Inconvénients** :

- La synchronisation des bases de données est un programme supplémentaire à maintenir
- Un bug dans la réplication peut entrainer un inconsistence de données qui va apparaître directement à l’utilisateur
- Il y a maintenant 2 schémas de base de données à maintenir : il est donc plus difficile de faire évoluer la structure de données.

<div class="callout" style="background-color:#ddfff2">

**Remarque** : en CQRS-EventSourcing, la base de référence n’est pas une base relationnelle mais une base stockant des événements (EventStore). La synchronisation de la base de lecture se fait en projetant les événements métiers dans la structure de lecture.

</div>

## Quand appliquer CQRS ?

Voici un petit aperçu des étapes de migration d’un projet dit « standard » vers un projet CQRS. A chaque étape sont lot d’avantages mais aussi une complexité globale croissante.

CQRS convient à **des domaines métiers complexes**, dans lesquels le DDD ([Domain-Driven Design](https://domainlanguage.com/ddd/)) à du sens. Pour de simples applications type CRUD, mettre en place du CQRS peut s’avérer couteux et contre productif. De plus, la décision de structurer une application avec CQRS dépend de chaque *Bounding Context* et ne doit pas être vu comme une solution à appliquer globalement.

Cela étant dit, j’aime particulièrement l’étape 1 de transition (séparation des modèles de lecture et modèles d’écriture) qui peut s’appliquer facilement sur beaucoup de projets.

## Pour plus de lecture sur le sujet

Je vous recommande 2 très bons articles des *maîtres* :

- [Martin Fowler : CQRS](https://www.martinfowler.com/bliki/CQRS.html)
- [Greg Young : CQRS Document](https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf)
