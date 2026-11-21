---
title: 'Behavior Driven Development, kesako ?'
date: '2013-08-18T16:43:00'
category: BDD
categories:
  - BDD
  - Good practices
  - TDD
cover: /images/blog/dylan-gillis-kdeq-a3a-tn-by-unsplash.webp
excerpt: >-
  Avec le TDD, cette méthode de développement est devenue incontournable afin
  d’obtenir un logiciel de qualité et répondant aux besoins du client. Dans cet
  article, on voit précisément ce qu’elle est !
---

Avec le TDD, cette méthode de développement est devenue incontournable afin d’obtenir un logiciel de qualité et répondant aux besoins du client. Dans cet article, on voit précisément ce qu’elle est !

## Définition

Le « *Behavior Driven Development* » (BDD) est une méthode de développement logiciel, créée par **Dan North** en 2003, qui encourage la communication **directe** entre les personnes en charge du besoin et l’équipe en charge d’y répondre. Le but est de créer **ensemble** un produit qui répond exactement aux attentes du client. Le maître mot : la **compréhension des acteurs**.

On peut définir plus précisément les acteurs de la manière suivante :

- **Les personnes en charge du besoin** : ils sont le client, les représentant du client ou les experts métiers dans une entreprise. Ils connaissent parfaitement le besoin qui amène la création du produit.
- **L’équipe de développement** : elle est l’ensemble des personnes qui tenterons de répondre aux besoins établis grâce à des outils techniques.

Étrangement (ou pas), ces deux acteurs ne se fréquentent pas vraiment au quotidien. Sans exagération, aucune :

- Les uns pensent des autres que ce sont des **geeks** renfermés et inintéressants de part leur propension à utiliser en permanence **un vocabulaire technique incompréhensible**. 
- Les autres se défendent en prétendant que ces premiers sont des farfelus, des gens qui **ne savent jamais ce qu’ils veulent** et que tout est toujours mieux dans leur tête que sur le papier.

Et pourtant dans la vraie vie, ces acteurs sont amenés à collaborer !

## La communication : essence du BDD

Avec ces divergences, il est souvent compliqué de se comprendre :

<figure class="align-center">
  <a href="/images/blog/misunderstanding.webp"><img src="/images/blog/misunderstanding.webp" alt="" width="400" height="297" /></a>
</figure>

Le BDD est un méthode qui implique les deux partis dans un processus de communication efficace. Ils sont tous deux mis à contribution et chacun doit sortir de sa zone de confort :

- **Les personnes du besoin** doivent formaliser leurs besoins, leurs idées, non plus sur un document Word de 500 pages, mais selon des scénarios dans un langage structuré.
- **L’équipe** doit s’impliquer dans le besoin, comprendre le contexte, les termes métiers importants. Elle ne reste plus dans son monde de technique de *Design Patterns*, de *Sockets*, de *Dll*, de *Batch*… 

Les questions posées aux *personnes du besoins* ou même à un membre de l’équipe ne doivent plus ressembler à :

<blockquote class="large">

« *La Factory de Patient doit-elle pouvoir utiliser l’index de téléphone en paramètre ?* »

</blockquote>

mais plutôt à :

<blockquote class="large">

« *Les coordonnées téléphoniques sont-elles obligatoires pour enregistrer un patient ?*« .

</blockquote>

## Expliquer le besoin grâce aux scénarios : l’exemple de *Cucumber*

Afin que les personnes du besoin et l’équipe de développement puissent se comprendre, il est indispensable d’utiliser des exemples et des scénarios.

Pour les écrire, différentes outils permettent de les normaliser, dont notamment [la syntaxe Guerkin :](https://docs.cucumber.io/gherkin/) *[Cucumber](https://docs.cucumber.io/gherkin/)*[.](https://docs.cucumber.io/gherkin/) Elle consiste à créer des scénarios structurés en différentes étapes (*Steps*) chacune commençant par des mots clés spécifiques :

- Feature
- Example (or Scenario)
- Given, When, Then, And, But (steps)
- Background
- Scenario Outline (or Scenario Template)
- Examples
- …

Selon les outils implémentant *Cucumber*, il est bien sûr possible d’écrire en français chaque mot clé. C’est plus pratique d’exprimer un besoin dans la langue de Molière !

Exemple pour un comportement graphique :

<div class="callout" style="background-color:#eff9ff">

**Scénario**: Activation du bouton de validation du formulaire de patient<br />
– **Etant donné** le formulaire de création de patient ouvert<br />
– **Et** le bouton « *Valider* » est inactif<br />
– **Quand** je saisie le nom « *Test*« <br />
– **Et** je saisi le prénom « *Test*« <br />
– **Et** je saisi l’âge « *18*« <br />
– **Alors** le bouton « Valider » devient actif

</div>

Exemple pour un comportement purement métier :

<div class="callout" style="background-color:#e8f8ff">

**Scénario**: Ajout d’articles dans un panier d’achat<br />
– **Etant donné** un panier vide<br />
– **Quand** j’ajoute un article de **8** euros dans le panier<br />
– **Et** j’ajoute un article de **10** euros dans le panier<br />
– **Alors** le montant du panier est automatiquement calculé<br />
–**Et** le montant du panier vaut **18** euros

</div>

Les scénarios peuvent être aussi « *variabilisés* » avec des exemples. Cela permet de générer un grand nombre de cas d’utilisation avec la même structure de scénario.

<div class="callout" style="background-color:#eaf9ff">

**Scénario** : Authentification sur un portail<br />
–**Etant donné** un compte de login « *admin* » et de mot de passe « *admin159* » valide<br />
– **Quand** j’ouvre le formulaire d’authentification<br />
– **Et** je saisis l’identifiant « <*login*\> »<br />
– **Et** je saisi le mot de passe « <*password*\> »<br />
– **Et** je valide le formulaire<br />
– **Alors** le message d’erreur « <*message*\> » s’affiche<br />
– **Exemples**:<br />
| *login*  |*password* | *message*<br />
| admin  | admin | L’identifiant ou le mot de passe est invalide.<br />
| admin2 | admin159 | L’identifiant ou le mot de passe est invalide.<br />
| admin2 | admin2| L’identifiant ou le mot de passe est invalide.<br />
|admin  |admin159|

</div>

Cette syntaxe permet de donner une vision très claire de la fonctionnalité attendue. Mais pour palier les problèmes de compréhension, il est important que tout le monde utilise **un langage commun**, appelé aussi en DDD : *[Ubiquitous Language](https://www.agilealliance.org/glossary/ubiquitous-language/)*[.](https://www.agilealliance.org/glossary/ubiquitous-language/) De plus, il faut établir une nomenclature partagée récapitulant l’ensemble des règles d’écriture, afin de standardiser les scénarios.

## En .Net : l’outil de test *Specflow*

Cette libraire .Net permet, en fonction des scénarios écrits, de générer automatiquement des méthodes de test unitaire que l’équipe doit implémenter. Très pratique car les scénarios utilisateurs deviennent directement les tests de l’application !

<figure class="align-center">
  <img src="/images/blog/specflow-tests.webp" alt="" width="463" height="282" />
  <figcaption>Génération des tests avec <em>Specflow</em></figcaption>
</figure>

Pour en savoir plus, rendez-vous sur [le site officiel de](https://specflow.org/) *[Specflow](https://specflow.org/)*.

## *Behaviour Driven Development* vs *Test Driven Development*

Dan North l’a dit lui même, il a inventé le BDD car quand on parle du TDD les acteurs entendent le mot « Test » et se braquent. En fait, pour lui, TDD et BDD sont la même chose.

Depuis sa création, la communauté s’est saisie du BDD et sa définition à légèrement évoluée. La rédaction des scénarios d’acceptation en utilisant du Gherkin est maintenant collectivement considérée comme étant du BDD, même si on pourrait écrire la même chose en TDD.

*In fine*, l’équipe de développement exécute des tests d’acceptation hauts niveau évaluant des cas d’utilisation (use cases) entiers, et non de simples méthodes de classes. Ces tests hauts niveau permettent de développer en utilisant la « double loop », c’est à dire qu’un test d’acceptance est une succession de tests unitaires :

<figure class="align-center">
  <img src="/images/blog/bdd-cycle3.webp" alt="" width="413" height="460" />
</figure>

## Exemple complet en C# avec SpecFlow

Pour un exemple complet de l’utilisation des scénarios via la méthodologie BDD, rendez-vous à **[l’article du Kata Potter](/bdd-lexemple-du-kata-potter/)**.

## Les avantages du BDD pour l’équipe technique

- **Avantages techniques**
    - permet de **générer des tests unitaires** pour piloter le développement
    - permet de **structurer un design** de classes piloté par le métier
    - permet d’**obtenir des spécifications claires, concises et vivantes** : elles évoluent en fonction des besoins et restent toujours **en accord avec le code !**
    - permet d’**obtenir un « cahier de recette » automatisé** : plus besoin d’un n ème intermédiaire, appelé aussi « Testeur », pour jouer et rejouer les scénarios. Les scénarios en BDD entrent dans l’intégration continue et les tests automatisés.
- **Avantages humains**
    - permet d’**adopter naturellement le langage du besoin, le domaine**
    - permet de comprendre, d’être compris par le client et de proposer des idées pertinentes avec son besoin.

Un point très intéressant du BDD : **un problème technique reflète presque toujours un manque ou une incohérence fonctionnelle**. J’ai pu le constater personnellement à maintes reprises. Lorsqu’en tant que développeur nous sommes confrontés à un bug, à un problème technique ou un problème de conception, c’est presque automatiquement : 

- soit une **erreur de compréhension du métier**
- soit une **mauvaise écriture des scénarios métier**

## Les avantages du BDD pour les personnes du métier

- **permet de guider l’écriture du besoin** : la syntaxe étant très contraignante, elle aide à cerner précisément le besoin et banni le superflu.
- **aide à prioriser le besoin**
- **permet de mieux se faire comprendre** : il n’y a pas de garantie mais un besoin écrit avec un langage intermédiaire établit de manière claire entre les partis, a de meilleurs chances d’être compris par un équipier qu’**un mail de 400 lignes** ou un document Word écrit de bonne volonté.

## Les inconvénients du BDD

Malgré tous ces avantages, la méthodologie BDD possède néanmoins quelques inconvénients :

- **Très forte implication des personnes du besoin.** En effet, ils ont la responsabilité d’écrire les différents scénarios à implémenter.
- **L’écriture des scénarios force à re-re-re-réfléchir.** Et oui, cela peut être vu comme un inconvénient surtout par les personnes ayant la vision métier mais répétant sans cesse : « Ne me pose pas la question, c’est écrit dans le document 15, paragraphe 501, ligne 135 ! ». Ecrire les scénarios, même complexe, c’est se replonger dans le besoin et **être pragmatique sur ce que l’on souhaite modéliser**. Un exercice intellectuel qui est loin d’être facile, même pour les personnes ayant la meilleure vision des besoins.
- **Forte implication de l’équipe**. En effet, l’équipe doit s’impliquer dans le processus et jouer le jeu. Les scénarios doivent être implémentés et **bien** ! Chaque membre de l’équipe est responsable des fonctionnalités implémentées.

## Les erreurs les plus courantes

Voici quelques exemples d’erreurs les plus courantes lors de l’utilisation de la méthodologie BDD :

- **L’équipe écrit ou modifie les scénarios sans l’accord des personnes du besoin.** La méthodologie du BDD consiste à être au plus proche du besoin. Si l’équipe modifie les scénarios, on risque de s’éloigner du besoin originel voir même de **créer des fonctionnalités inutiles**.
- **Les scénarios ne sont pas implémentables**. Ce problème vient d’un mauvais compromis entre les deux partis. Les contraintes d’implémentions doivent être mises au claire lors de la formulation de la nomenclature d’écriture. Exemple de formulation très difficile à implémenter :
    - **Etant donné** un utilisateur qui n’est pas ‘administrateur’
    - **Etant donné** pour tous les mots de passe non valides
    - **Quand** je ne clique pas …
    - **Alors** tout va bien
- **Les scénarios ne sont pas implémentés correctement.** La plupart du temps, les scénarios sont assez clairs pour être implémentés par l’équipe sans difficulté en terme de compréhension. Cependant, certains peuvent être très compliqués. Un scénario mal implémenté correspond souvent à un scénario qu’**un développeur n’a vraiment pas compris**. Il faut favoriser les communications entre les acteurs, même pendant l’implémentation de scénarios. Si un scénario est compliqué, il faut pouvoir entamer la discussion avec les membres de l’équipe ou la personne du besoin en charge de les écrire. Seul l’échange peut éclaircir rapidement l’incompréhension.

## Conclusion

Le BDD est un méthode de développement très intéressante qui met au centre **la communication entre les personnes du besoin et l’équipe de technique**. Chaque parti doit sortir de sa zone de confort pour travailler avec un langage structuré intermédiaire. Couplés avec une méthode agile et des scénarios faisant offices de critères d’acceptation des *user-stories*, elle permet à l’équipe d’être complètement immergée dans les **vraies problématiques du client** et ainsi d’être en mesure de proposer des solutions qui correspondent vraiment à ses attentes.

Le client quant à lui, voit (avec émerveillement) l’avancement de son produit, sprint par sprint et n’est plus surpris de son bon fonctionnement.

Etant développeur, et appliquant le BDD quotidiennement dans mon entreprise, j’ai pu réaliser l’importance d’être impliqué dans le besoin du client. Le langage structuré permet d’être en contact directement avec ce qu’il souhaite avec **moins d’erreur de compréhension**. Couplé avec du TDD pour le design du code, on obtient un logiciel répondant exactement au besoin du client et de très bonne qualité (robustesse et non régression).  

Dans une époque où l’équipe de développement devient le centre des attentions notamment grâce aux méthodes agiles, **j’encourage les développeurs à s’intéresser à ce type de pratique**. Il est vrai que dans certains contextes, les personnes du besoin ne sont pas toujours disponibles où ne veulent pas s’impliquer davantage dans l’écriture des scénarios.

Mais dans ce cas, la vraie question serait : *Pourquoi les personnes qui ont la meilleure vision des besoins ne veulent-elle pas s’investir dans un processus qui **garantit** les fonctionnalités et la qualité du produit final ?*

A méditer.
