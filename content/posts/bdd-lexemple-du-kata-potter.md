---
title: 'Le Kata Potter, illustré en Behaviour Driven Developpment'
date: '2013-10-02'
category: BDD
categories:
  - BDD
  - Good practices
  - Kata
cover: /images/blog/shayna-douglas-tqv8qkwu-ez-a-unsplash1.webp
excerpt: >-
  Dans cet article, je vais présenter l’utilisation de la méthodologie «
  Behavior Driven Development » (BDD) au travers d’un exemple complet du très
  connu Kata Potter. A vos claviers !
---

Dans cet article, je vais présenter l’utilisation de la méthodologie « *Behavior Driven Development* » (BDD) au travers d’un exemple complet du très connu **Kata Potter**. A vos claviers !

## Introduction

Cet article s’adresse à ceux qui aimerait **mieux comprendre voir perfectionner leur connaissance du BDD et de** **la syntaxe Gherkin**. Je résoudrais l’énoncé du *Kata Potter* en détaillant chaque étape et en expliquant la démarche.

Cet exemple a pour but d’illustrer la puissance du BDD grâce à l’écriture de scénarios très clairs qui amèneront l’implémentation de l’exemple. Le but n’est pas de faire un design de classe parfait mais d’avoir une approche pédagogique.

Cet article nécessite une connaissance minimale en language objet, je présente du code en C# avec l’outil Specflow.

Vous pouvez retrouver les étapes d’installation du framework sur [le site officiel](https://docs.specflow.org/projects/getting-started/en/latest/index.html).

Pour une vision plus large et une meilleure compréhension de ce qu’est le BDD, vous pouvez vous reportez **[au précédent article](http://pgillon.blogspot.fr/2013/08/bdd-behaviour-driven-development.html)**, plus général.

## Code source complet

Vous trouverez l’ensemble du code source de l’exercice sur Github ici : [https://github.com/pierregillon/katapotter](https://github.com/pierregillon/katapotter).

## Énoncé du katta Potter

> Once upon a time there was a series of 5 books about a very English hero called Harry. (At least when this Kata was invented, there were only 5. Since then they have multiplied). Children all over the world thought he was fantastic, and, of course, so did the publisher. So in a gesture of immense generosity to mankind, (and to increase sales) they set up the following pricing model to take advantage of Harry’s magical powers.
> 
> One copy of any of the five books costs 8 EUR. If, however, you buy two different books from the series, you get a 5% discount on those two books. If you buy 3 different books, you get a 10% discount. With 4 different books, you get a 20% discount. If you go the whole hog, and buy all 5, you get a huge 25% discount. Note that if you buy, say, four books, of which 3 are different titles, you get a 10% discount on the 3 that form part of a set, but the fourth book still costs 8 EUR.
> 
> Potter mania is sweeping the country and parents of teenagers everywhere are queuing up with shopping baskets overflowing with Potter books. Your mission is to write a piece of code to calculate the price of any conceivable shopping basket, giving as big a discount as possible.

### **Règles réduites**

D’après l’énoncé, voici les règles réduites que l’on peut extraire :  

1.  [Un livre coûte](#scenario1) **[8 euros](#scenario1)**
2.  [L’achat de 1 livre n’apporte](#scenario2) **[aucune réduction](#scenario2)**
3.  [L’achat de 2 livres différents apporte](#scenario3) **[une réduction de 5%](#scenario3)**
4.  [L’achat de 3 livres différents apporte](#scenario4) **[une réduction de 10%](#scenario4)**
5.  [L’achat de 4 livres différents apporte](#scenario56) **[une réduction de 20%](#scenario56)**
6.  [L’achat de 5 livres différents apporte](#scenario56) **[une réduction de 25%](#scenario56)**
7.  [Lors de l’achat d’un ensemble de livres, et pour avoir](#scenario7) **[la plus petite réduction](#scenario7)**[, ces livres sont regroupés dans différents lots auxquels on applique la réduction appropriée.](#scenario7)

<div class="callout" style="background-color:#e7f8ff">

**Remarque :** Pour ceux qui connaissent ce *Coding Dojo*, nous sauterons la partie de regroupement optimum des livres pour atteindre le prix le plus bas. Nous partons du principe que les livres sont regroupés par nombre maximum de différence.  
Par exemple : l’achat de 2 tome 1, 2 tome 2, 2 tome 3, 1 tome 4 et 1 tome 5 donne deux regroupements : un groupe \[ **1, 2, 3, 4, 5 \]** et \[ **1, 2, 3 \]**.

</div>

## Let’s code !

### Préparation du fichier « *.feature* »

Tout d’abord, nous devons préparer le fichier « .*feature* ». Une fois SpecFlow installé, faites un clic droit sur le projet -> « *Add …* » -> « *New item* » puis sélectionner « **SpecFlow Feature File** » :

<figure>
  <img src="/images/blog/bdd-add-feature-file.webp" alt="" width="900" height="460" />
</figure>

Ce fichier permet de définir une **fonctionnalité**. On trouve deux parties à ce fichier :  

-   **L’entête** : elle permet de décrire la fonctionnalité selon les 3 propositions : « En tant que », « Je souhaite », « Pour ». Ces concepts sont similaires à la méthode *Scrum* lors de la description d’une *UserStory*.
-   **Les scénarios** : ce sont l’ensemble des critères d’acceptations qui permettent de savoir si la fonctionnalité est valide. On peut définir autant de scénarios que l’on souhaite ainsi que des exemples de jeu de données. Un scénario représente un cas d’utilisation concret de la fonctionnalité.

Pour l’exemple, j’ai appelé le fichier « *BasketPriceCalculation.feature* ». Il regroupera comme son nom l’indique, l’ensemble des scénarios pour le calcul du prix du panier d’achat. Dans l’entête, nous pouvons décrire la fonctionnalité de la manière suivante :

```text
Feature: Basket price calculation
	In order to buy Harry Potter books
	As a customer
	I want to know the price of my basket
```

Nous allons maintenant écrire différents scénarios et les implémenter afin de répondre au mieux à l’énoncé. **Nous allons piloter le développement de l’application par le comportement attendu.** Chaque fonctionnalité sera détaillée en 3 étapes : écriture du scénario, implémentation du scénario, exécution du test et *refactoring*.  

### Scénario 1 : Définition d’un livre

Le premier scénario à implémenter est :

<blockquote class="large">

« *Un livre coûte 8 euros.*  »

</blockquote>

#### Ecriture du scénario

On définit ici la première notion la plus importante : le **livre**.  
Grâce aux deux mots clés « *Given* » et « *Then* », on peut décrire cette proposition de la manière suivante :

```text
Scenario: Definition of a book
Given A book
Then The book price is 8 euros
```

C’est aussi simple que ça.  
  
La proposition « *Given A book* » représente **une précondition** alors que la proposition « *Then The book price is 8 euros* » représente **une post-condition**. La phrase située à droite de « *Scenario:* » est le titre du scénario. C’est ce qui apparaîtra dans l’explorateur de tests.

Comme c’est le premier scénario, nous devons générer le fichier « *Steps* » qui contiendra le code généré. Pour ce faire, faites un clic droit dans le fichier « .*feature* » ->  « *Generate Step Definition* **»**. La fenêtre suivante s’affiche :   

<figure class="align-center">
  <img src="/images/blog/bdd-generate-step-definition.webp" alt="" width="433" height="327" />
</figure>

Vous pouvez cliquer sur « *Generate* » et indiquez ensuite le chemin vers votre projet de tests. Le fichier est ajouté à votre solution :  

<figure class="align-center">
  <a href="/images/blog/bdd-generate-step-definition-result.webp"><img src="/images/blog/bdd-generate-step-definition-result.webp" alt="" width="300" height="143" /></a>
</figure>

  Votre fichier « *Steps* » contient la définition des méthodes à implémenter : 

```csharp
    public class BasketPriceCalculationFeatureSteps
    {
        [Given(@"A book")]
        public void GivenABook()
        {
            ScenarioContext.Current.Pending();
        } 
        
        [Then(@"The book price is (.*) euros")]
        public void ThenTheBookPriceIsEuros(decimal expectedPrice)
        {
            ScenarioContext.Current.Pending();
        }
    }
```

La magie opère. Nous retrouvons les phrases du scénario que nous avons écrit dans les attributs des différentes méthodes générées (ainsi que dans leur nom) sous forme d’expression régulière. Le données de la phrase sont automatiquement extrait dans un paramètre du bon type.

La méthode *ScenarioContext.Current.Pending()* signifie que le test n’est pas implémenté et qu’il sera « *ignoré* ». On remarque que les méthodes générées peuvent être vides ou avec paramètres :  

-   La méthode « *GivenABook* » ne prend aucun paramètre.
-   La méthode « *ThenTheBookPriceIsEuros*»  prend un paramètre de type **entier**.

  Si l’on lance les tests, on obtient un test jaune qui correspond à un test « *ignoré* ».

<div class="callout" style="background-color:#edfaff">

**Remarque** : Il faut faire très attention à la manière dont on écrit les scénarios. Chaque phrase écrite génère un code qui lui est associée. Les guillemets \[ **« »** \] ou apostrophe \[ ‘’ \] sont considérés comme encadrant une variable. La méthode générée devient donc différente. Dans notre cas, l’utilisation d’un nombre au milieu d’une phrase ajoute automatiquement un paramètre dans la méthode associée.

</div>

#### Implémentation du scénario

Maintenant que nous avons les méthodes, comment les implémenter ?

Le mot clé « *Given* » signifie qu’il faut initialiser un objet dans le test et le mot clé « *Then* » signifie qu’il faut tester l’état d’un objet initialisé. La méthode « *GivenABook»* doit donc créer un livre et l’enregistrer. La méthode *« ThenTheBookPriceIsEuros*» doit comparer une propriété « *Price* » du livre initialisé. Le « The » de « **The** Book Price » fait bien référence au précédent livre. Ces méthodes sont appelées dans l’ordre du scénario par SpecFlow. La méthode « *GivenABook»* précède *« ThenTheBookPriceIsEuros*».

Une question importante apparaît : comment partager de l’information entre les méthodes, ici le livre ? De manière naturelle, on peut déclarer **un attribut** de la classe « *Steps* » pour sauvegarder le résultat de la méthode « *GivenABook* » pour ensuite l’utiliser dans « *ThenTheBookPriceIsEuros*».  De plus, la représentation d’un prix est souvent faite en nombre flottant. On peut donc changer le type du paramètre en decimal.

On obtient le code 

```csharp
    [Binding]
    public class BasketPriceCalculationFeatureSteps
    {
        private Book _book;
 
        [Given(@"A book")]
        public void GivenABook()
        {
            _book = new Book();
        }

        [Then(@"The book price is (.*) euros")]
        public void ThenTheBookPriceIsEuros(decimal expectedPrice)
        {
            Assert.AreEqual(expectedPrice, _book.Price, "Le prix du livre est incorrect.");
        }
    }
```

Une fois le test écrit, on peut définir la classe Book avec une implémentation très simple uniquement dans le but de faire compiler le test :

```csharp
    public class Book
    {
        public decimal Price { get; private set; }
    }
```

<div class="callout" style="background-color:#e5f7ff">

**Remarques :** De manière plus générale, pour des projets plus importants, on associe rarement un fichier « *Feature* » avec un fichier « *Steps* ». En fait, Specflow nous permet de réutiliser des propositions « *Given* », « *When* », « *Then* » présentent dans d’autres fichiers « *Feature* » :       Pour ce faire, on n’utilise plus de champs dans les classes « *Steps* », mais on ajoute les variables dans le ScenarioContext. Pour plus d’information, consultez [le site wiki officiel](https://github.com/techtalk/SpecFlow/wiki/ScenarioContext).

</div>

#### Implémentation du métier et *refactoring*

Bien entendu, si l’on lance le test, on obtient une magnifique couleur rouge :

<figure class="align-center">
  <a href="/images/blog/bdd-test-result1.webp"><img src="/images/blog/bdd-test-result1.webp" alt="" width="300" height="153" /></a>
</figure>

En effet, par défaut le prix du livre est à 0 euros, ce qui fait échouer le test.  
Pour le faire passer, de la manière la plus simple, il suffit d’initialiser la propriété « *Price* » du livre dans son constructeur :  

```csharp
    public class Book
    {
        public Book()
        {
            Price = 8;
        }

        public decimal Price { get; private set; }
    }
```

<figure class="align-center">
  <a href="/images/blog/bdd-test-result1-1.webp"><img src="/images/blog/bdd-test-result1-1.webp" alt="" width="300" height="36" /></a>
</figure>

Aucun refactoring n’est à réaliser, nous avons implémenté notre premier test en BDD !  

### Scénario 2 : Réduction avec 1 livre

Le prochain scénario à implémenter est :  

<blockquote class="large">

« *L’achat de 1 livre n’apporte **aucune réduction*** »

</blockquote>

Une notion très importante ici est la notion d’**achat**. Comment représenter ce concept et l’implémenter ? Une propriété booléenne « EstAchete » dans le livre ? Un objet « Achat » ?

Pour l’exemple, j’ai choisi de l’implémenter en utilisant le concept de **panier d’achat**. Il y a donc une notion d’**ajout de livre** au sein d’un **panier d’achat**.

#### Ecriture du scénario

Nous pouvons donc écrire le scénario suivant :

```text
Scenario: Discount of 0% for 1 book
Given A basket
When I add a book to basket
Then The basket price is 8 euros
```

Parlant non ?

Maintenant, nous devons générer le code associé. Vous remarquez que les propositions non implémentées sont en **violet**. Pour les générer, cliquez sur une proposition par exemple « *Given A basket* » puis faites « *Go To Definition* ». Un écran vous présente la méthode générée et vous propose de la mettre dans le presse-papier :

<figure class="align-center">
  <img src="/images/blog/bdd-go-to-binding.webp" alt="" width="393" height="242" />
</figure>

En acceptant, la méthode est enregistrée et vous pourrez la coller directement dans le fichier « *Steps* ». Je recommande de générer et d’implémenter les propositions une à une. La règle du « *baby steps* » est très importante ici, car cela simplifie le problème et fait émerger doucement le design des classes. Vous pouvez aussi réutiliser l’écran « *Generate Step Definition* » comme vu dans le premier exemple.  

#### Implémentation du scénario

**GivenABasket**

La méthode générée est :

```csharp
        [Given(@"A basket")]
        public void GivenABasket()
        {
            ScenarioContext.Current.Pending();
        }
```

Etant une pré-condition, l’implémenter ressemble à « *GivenABook* ». Cela donne :

```csharp
        private Basket _basket;

        [Given(@"A basket")]
        public void GivenABasket()
        {
            _basket = new Basket();
        }
```

**WhenIAddABookToBasket**

La méthode générée est :

```csharp
        [When(@"I add a book to basket")]
        public void WhenIAddABookToBasket()
        {
            ScenarioContext.Current.Pending();
        }
```

Pour l’implémenter, il faut ajouter le concept d’opération **d’ajout d’un livre dans la classe «** ***Basket*** **»**. Un exemple d’implémentation serait :

```csharp
       [When(@"I add a book to basket")]
        public void WhenIAddABookToBasket()
        {
            var book = new Book();
            _basket.AddBook(book);
        }
```

**ThenTheBasketPriceIsEuros**

La méthode générée est :

```csharp
        [Then(@"The basket price is (.*) euros")]
        public void ThenTheBasketPriceIsEuros(Decimal p0)
        {
            ScenarioContext.Current.Pending();
        }
```

L’implémenter est aussi simple que « *ThenTheBookPriceIsEuros* ». On ajoute un concept de prix « *Price* » dans l’objet « *Basket* » :

```csharp
        [Then(@"The basket price is (.*) euros")]
        public void ThenTheBasketPriceIsEuros(decimal expectedBasketPrice)
        {
            Assert.AreEqual(expectedBasketPrice, _basket.Price, "Le prix du panier est incorrect.");
        }
```

**Classe Basket**

Pour faire compiler la classe de test, il faut bien sûr générer la classe « *Basket* » :

```csharp
    public class Basket
    {
        public decimal Price { get; private set; }
        
        public void AddBook(Book book)
        {
            throw new NotImplementedException();
        }
    }
```

#### Implémentation du métier et *refactoring*

Une fois tout le scénario implémenté, nous pouvons lancer les tests. A la première exécution, on obtient bien sûr :    

<figure class="align-center">
  <a href="/images/blog/bdd-test-result1-2.webp"><img src="/images/blog/bdd-test-result1-2.webp" alt="" width="300" height="223" /></a>
</figure>

Il faut implémenter la méthode « *AddBook* » dans la classe « *Basket* ». On peut maintenant amener le concept « évident » de liste de livres au sein du panier d’achat :

```csharp {10}
    public class Basket
    {
        private readonly List<book> _books = new List<book>();

        public decimal Price { get; private set; }
        
        public void AddBook(Book book)
        {
            if (book == null) throw new ArgumentNullException("book");
            _books.Add(book);
        }
    }
```

Si on le relance le test :  

<figure class="align-center">
  <a href="/images/blog/bdd-test-result1-3.webp"><img src="/images/blog/bdd-test-result1-3.webp" alt="" width="300" height="189" /></a>
</figure>

En effet, le prix du panier d’achat ne tient pour l’instant pas compte des livres. Il faut modifier la propriété « *Price* » pour calculer **la somme des prix des livres**. On obtient :

```csharp {7}
    public class Basket
    {
        private readonly List<book> _books = new List<book>();

        public decimal Price
        {
            get { return _books.Sum(book => book.Price); }
        }

        public void AddBook(Book book)
        {
            if (book == null) throw new ArgumentNullException("book");
            _books.Add(book);
        }
    }
```

Et cette fois :  

<figure class="align-center">
  <a href="/images/blog/bdd-test-result1-4.webp"><img src="/images/blog/bdd-test-result1-4.webp" alt="" width="300" height="48" /></a>
</figure>

### Scénario 3 : Réduction avec 2 livres

Le prochain scénario à implémenter est :

<blockquote class="large">

« L’achat de **2 livres différents** apporte une **réduction de** **5%** »

</blockquote>

Après la notion d’**achat**, vient la notion de **réduction**. Une question importante se pose : qu’est-ce que « deux livres *différent*s » ? La réponse est évidente : ce sont deux livres de « *tomes* » différents (en anglais « *volume* »). D’après l’énoncé, nous avons 5 tomes différents, numéroté de 1 à 5.  

#### Ecriture du scénario

Pour le scénario, nous devons prendre un exemple concret. Ajoutons 1 livre du tome 1 et un livre du tome 2 au panier, on obtient le scénario suivant :

```text
Scenario: Discount of 5% for 2 different books
Given A basket
When I add a book of volume 1 to basket
       And I add a book of volume 2 to basket
Then The basket price is 15.20 euros
```

Intéressant, mais pourquoi 15.20€ ? Une réduction de 5% sur deux livres à 8 euros donne : **2  \* 8 \* 0.95 = 15.20€.**

Rappelez-vous qu’un scénario doit décrire **un exemple factuel**, alimenté de données. Autre point intéressant : nous réutilisons des propositions écrites du scénario précèdent ! En effet, « *Given A basket* » et « *Then The basket price is x euros* » sont réutilisées. On le remarque car la couleur des propositions est noire. Il ne reste à implémenter que la proposition « *When I add a book of volume x to basket*».  

#### Implémentation du scénario

Une implémentation de cette proposition pourrait être :

```csharp
        [When(@"I add a book of volume (.*) to basket")]
        public void WhenIAddABookOfVolumeToBasket(int volumeNumber)
        {
            var book = new Book { VolumeNumber = volumeNumber };
            _basket.AddBook(book);
        }
```

Avec la propriété « *VolumeNumber* » ajoutée dans la classe « *Book* ».  

#### Implémentation du métier et *refactoring*

L’exécution des tests donne :  

<figure class="align-center">
  <a href="/images/blog/bdd-test-result1-5.webp"><img src="/images/blog/bdd-test-result1-5.webp" alt="" width="300" height="189" /></a>
</figure>

Effectivement, pour l’instant, notre implémentation ne calcule le prix du panier que par **la sommedes prix des livres qu’il contient.** Pour résoudre ce problème, nous devons regrouper les livres par numéro de tome pour trouver combien sont différents et donc savoir si la réduction doit être appliquée. Nous allons donc modifier notre implémentation de la propriété « *Price* » de la classe « *Basket* » de la manière « *naïve* » suivante :

```csharp {8}
        public decimal Price
        {
            get
            {
                var price = _books.Sum(book => book.Price);
                var groupedBookByVolume = _books.GroupBy(book => book.VolumeNumber) .ToList();
                if (groupedBookByVolume.Count() == 2) {
                    return price * 0.95m;
                }
                return price;
            }
        }
```

Ainsi, en groupant les livres par numéro de tome, on peut savoir s’il faut appliquer une réduction.

<div class="callout" style="background-color:#effaff">

**A retenir :** Un aspect très intéressant des scénarios écrits avec *SpecFlow* est la **réutilisabilité**. Dans l’exemple précédent, pour faire passer notre test, nous n’avons eu à implémenter qu’une seule méthode : « *WhenIAddABookOfVolumeToBasket* ». Les méthodes « *GivenABook*  » et « *ThenTheBasketPriceIsEuros* » ont été réutilisées. De manière générale, si les scénarios sont bien écrits et réutilise les propositions déjà implémentées, leur vitesse d’implémentation va en s’accélérant. Ce qui est très puissant, c’est qu’un nouveau scénario de 200 lignes peut être implémenté par le développeur en **quelques secondes**.

</div>

### Scénario 4 : Réduction de 3 livres

Le prochain scénario à implémenter est :

<blockquote class="large">

« L’achat de **3** livres différents apporte une réduction de **10%** »

</blockquote>

Dans ce cas, aucune nouvelle notion ne vient s’ajouter. On peut écrire directement le nouveau scénario.  

#### Ecriture du scénario

Le scénario est :

```text
Scenario: Discount of 10% for 3 different books
Given A basket
When I add a book of volume 1 to basket
	And I add a book of volume 2 to basket
	And I add a book of volume 3 to basket
Then The basket price is 21.60 euros
```

On remarque qu’il n’y a aucune méthode à implémenter. Le scénario réutilise les 3 propositions déjà écrites.

Pour les petits malins, nous avons bien : **3 \* 8 \* 0.9 = 21.60€** 

#### Implémentation du métier et *refactoring*

Si l’on exécute le test, on obtient :

<figure class="align-center">
  <a href="/images/blog/bdd-test-result1-6.webp"><img src="/images/blog/bdd-test-result1-6.webp" alt="" width="300" height="175" /></a>
</figure>

En effet, au sein de la classe « *Basket* », on ne gère que la réduction sur 2 livres. On peut donc ajouter une nouvelle condition dans la propriété « *Price* » :

```csharp {11}
        public decimal Price
        {
            get
            {
                var price = _books.Sum(book => book.Price);
                var groupedBookByVolume = _books.GroupBy(book => book.VolumeNumber).ToList();
                if (groupedBookByVolume.Count() == 2) {
                    return price*0.95m;
                }
                if (groupedBookByVolume.Count() == 3) {
                    return price*0.90m;
                }
                return price;
            }
        }
```

  Si l’on ré-exécute :  

<figure class="align-center">
  <a href="/images/blog/bdd-test-result1-7.webp"><img src="/images/blog/bdd-test-result1-7.webp" alt="" width="300" height="80" /></a>
</figure>

Il est temps de faire du *refactoring*. On remarque que l’on compare toujours le nombre de livre groupé par une valeur et que nous en déduisons la réduction.  Pourquoi ne pas faire un dictionnaire stockant en clé le nombre de livre différent et en valeur le montant de la réduction ? Ou mieux, pourquoi ne pas créer un concept de catalogue de réduction nous permettant d’obtenir une réduction par rapport à un nombre de livre différent ? Je choisis la seconde proposition :

```csharp
    public class DiscountCatalog
    {
        private readonly Dictionary<int, decimal> _catalog = new Dictionary<int, decimal>
            {
                {1, 0},
                {2, 0.05m},
                {3, 0.10m},
            };

        public decimal GetDiscount(int numberOfDifferentArticles)
        {
            if (_catalog.ContainsKey(numberOfDifferentArticles) == false) {
                throw new Exception("No discount found for this number of different articles.");
            }
            return _catalog[numberOfDifferentArticles];
        }
    }
```

La classe « *Basket* » devient donc :

```csharp {12}
    public class Basket
    {
        private readonly List<Book> _books = new List<Book>();
        private readonly DiscountCatalog _discountCatalog = new DiscountCatalog();

        public decimal Price
        {
            get
            {
                var price = _books.Sum(book => book.Price);
                var numberOfDifferentBooks = _books.GroupBy(book => book.VolumeNumber).Count();
                return price*(1 - _discountCatalog.GetDiscount(numberOfDifferentBooks));
            }
        }

        public void AddBook(Book book)
        {
            if (book == null) {
                throw new ArgumentNullException("book");
            }
            _books.Add(book);
        }
    }
```

Si l’on relance les tests, tout est ok. Voilà un exemple d’implémentation plus satisfaisant.

### Scénario 5 et 6 : Réduction de 4 et 5 livres

Les deux prochains scénarios à implémenter sont :

> « L’achat de **4** livres différents apporte une réduction de **20%** »  
> « L’achat de **5** livres différents apporte une réduction de **25%** »

#### Ecriture des scénarios

On obtient deux scénarios :

```text
Scenario: Discount of 20% for 4 different books 
Given A basket
When I add a book of volume 1 to basket
	And I add a book of volume 2 to basket
	And I add a book of volume 3 to basket
	And I add a book of volume 4 to basket
Then The basket price is 25.60 euros
```

```text
Scenario: Discount of 25% for 5 different books
Given A basket
When I add a book of volume 1 to basket
	And I add a book of volume 2 to basket
	And I add a book of volume 3 to basket
	And I add a book of volume 4 to basket
	And I add a book of volume 5 to basket
Then The basket price is 30.00 euros
```

De la même manière que pour le scénario 3, il n’y a **aucun code à implémenter.**  

#### Implémentation du métier et *refactoring*

Pour faire passer ces deux tests, il suffit d’ajouter dans la classe « *DiscountCatalog* » la correspondance entre le nombre de livres différents 4 et 5 et leurs réductions réciproques :

```csharp {6,7}
  private readonly Dictionary<int, decimal> _catalog = new Dictionary<int, decimal>
            {
                {1, 0},
                {2, 0.05m},
                {3, 0.10m},
                {4, 0.20m},
                {5, 0.25m},
            };
```

  Ainsi, on obtient :  

<figure class="align-center">
  <a href="/images/blog/bdd-test-result1-8.webp"><img src="/images/blog/bdd-test-result1-8.webp" alt="" width="300" height="109" /></a>
</figure>

### Scénario 7 : Regroupement de livres

A ce point, nous avons effectué les 6 premières règles du Kata Potter, intégralement en BDD. Maintenant, viens la règle suivante :

<blockquote class="large">

« *Lors de l’achat d’un ensemble de livres, et pour avoir la plus petite réduction, ces livres sont regroupés dans différents **lots** auxquels on **applique la réduction appropriée**.* »

</blockquote>

Une nouvelle notion apparaît ici : la notion de **lots** de livres. Prenons un exemple pour mieux comprendre. Nous souhaitons acheter :  

-   1 livre du tome 1
-   2 livres du tome 2
-   2 livres du tome 3

Pour savoir quelles réductions appliquer, il faut regrouper ces livres dans des lots de livres différents afin d’avoir la plus haute réduction. En effet, plus le nombre de livres différents au sein d’un lot est important, plus la réduction est importante. Nous avons donc :  

-   Un lot des tomes **\[ 1, 2, 3 \]** : réduction de 10%
-   Un lot des tomes **\[ 2, 3 \]** : réduction de 5%

#### Ecriture des scénarios

L’exemple peut s’écrire en BDD de la manière suivante :

```text
Scenario: Discount of 20% for 4 different books
Given A basket
When I add a book of volume 1 to basket
	And I add a book of volume 2 to basket
	And I add a book of volume 2 to basket
	And I add a book of volume 3 to basket
	And I add a book of volume 3 to basket
Then The basket price is 25.60 euros
```

Même si écrire le scénario comme ci-dessus permet de réutiliser les propositions implémentées, on l’éloigne de son vrai but. Le scénario doit représenter un réel besoin métier et doit donc être **lisible** et **concis**. On peut regrouper les propositions d’achat de livre de même volume pour obtenir un scénario plus lisible :

```text
Scenario: Discount of 1 set of 3 books and 1 set to 2 books
Given A basket When I add 1 book(s) of volume 1 to basket
	And I add 2 book(s) of volume 2 to basket
	And I add 2 book(s) of volume 3 to basket
Then The basket price is 36.80 euros
```

Si l’on pose le calcul, on obtient bien : **3 \* 8 \* 0.90 + 2 \* 8 \* 0.95 = 36.80 €**

#### Implémentation du scénario

Le code généré est :

```csharp
        [When(@"I add (.*) book(s) of volume (.*) to basket")]
        public void WhenIAddBookSOfVolumeToBasket(int p0, int p1)
        {
            ScenarioContext.Current.Pending();
        }
```

On remarque que cette proposition ressemble beaucoup à la proposition « *When I add a book of volume x to basket* », déjà implémentée. Nous pouvons ici réutiliser la méthode « *WhenIAddABookOfVolumeToBasket* » pour implémenter notre nouvelle proposition :

```csharp
        [When(@"I add (.*) book(s) of volume (.*) to basket")]
        public void WhenIAddBookSOfVolumeToBasket(int bookCount, int volumeNumber)
        {
            for (int i = 0; i < bookCount; i++) {
                WhenIAddABookOfVolumeToBasket(volumeNumber);
            }
        }
```

#### Implémentation du métier et *refactoring*

En exécutant les tests, on obtient :  

<figure class="align-center">
  <a href="/images/blog/bdd-test-result1-9.webp"><img src="/images/blog/bdd-test-result1-9.webp" alt="" width="300" height="281" /></a>
</figure>

Comment implémenter cette fonctionnalité ?

En fait, il faut pouvoir distribuer les livres du panier d’achat dans différents lots tout en gardant l’unicité d’un livre (via son numéro de tome). Dans cet exemple, j’ai fait le choix de donner la responsabilité à la classe « *Basket* » de trouver le bon lot dans lequel ajouter le livre du panier. La classe « *Basket* » va changer car elle va maintenant contenir une liste de « *BookSet* ». C’est cette classe qui contiendra désormais le code de calcul du prix avec la réduction.

La classe « Basket » devient :

```csharp
    public class Basket
    {
        private readonly List<BookSet> _bookSets = new List<BookSet>();

        public decimal Price
        {
            get { return _bookSets.Sum(bookSet => bookSet.Price); }
        }

        public void AddBook(Book book)
        {
            if (book == null) {
                throw new ArgumentNullException("book");
            }
            var added = false;
            foreach (var bookSet in _bookSets) {
                if (bookSet.Contains(book) == false) {
                    bookSet.AddBook(book);
                    added = true;
                    break;
                }
            }
            if (added == false) {
                var bookSet = new BookSet();
                bookSet.AddBook(book);
                _bookSets.Add(bookSet);
            }
        }
    }
```

Le code de la méthode « *AddBook()* » a pour responsabilité de trouver le bon lot dans lequel ajouter le livre. Si tous les lots contiennent déjà un tome du livre, alors la méthode crée un nouveau lot.

Quand à la classe « *BookSet* », elle ressemble beaucoup à l’ancienne implémentation de « *Basket* » :

```csharp
    public class BookSet
    {
        private readonly List<Book> _books = new List<Book>();
        private readonly DiscountCatalog _discountCatalog = new DiscountCatalog();

        public decimal Price
        {
            get
            {
                var price = _books.Sum(book => book.Price);
                var numberOfDifferentBooks = _books.GroupBy(book => book.VolumeNumber).Count();
                return price*(1 - _discountCatalog.GetDiscount(numberOfDifferentBooks));
            }
        }

        public void AddBook(Book book)
        {
            if (book == null) {
                throw new ArgumentNullException("book");
            }
            _books.Add(book);
        }
        public bool Contains(Book book)
        {
            if (book == null) {
                throw new ArgumentNullException("book");
            }
            return _books.Contains(book);
        }
    }
```

Si l’on relance les tests :

<figure class="align-center">
  <a href="/images/blog/bdd-test-result1-10.webp"><img src="/images/blog/bdd-test-result1-10.webp" alt="" width="300" height="281" /></a>
</figure>

Cela ne passe toujours pas : le prix est invalide… Mais c’est normal !

On vérifie s’il existe un lot contenant un **exemplaire du tome**, via la méthode « *Contains* ». Pour que cela fonctionne, il faut que deux livres de tome identique soit égaux ! Il faut donc surcharger la méthode « *Equals* » dans la classe « Book » :

```csharp {11}
    public class Book
    {
        public Book()
        {
            Price = 8;
        }

        public decimal Price { get; private set; }
        public int VolumeNumber { get; set; }

        public override bool Equals(object obj)
        {
            var book = obj as Book;
            if (book != null == false) {
                return base.Equals(obj);
            }
            return book.VolumeNumber == VolumeNumber;
        }
        public override int GetHashCode()
        {
            return VolumeNumber.GetHashCode();
        }
    }
```

    Et maintenant :  

<figure class="align-center">
  <a href="/images/blog/bdd-test-result1-11.webp"><img src="/images/blog/bdd-test-result1-11.webp" alt="" width="300" height="124" /></a>
</figure>

Fini ?

Non, presque. Red, Green, … ***Refactor*** ! Le code de la méthode « *AddBook* » dans la classe « *Basket* » ne semble pas très propre. Nous pouvons séparer les responsabilités cette méthode en deux:

-   La récupération du premier lot de livre disponible
-   La création du lot si nécessaire puis l’ajout du livre

```csharp
        public void AddBook(Book book)
        {
            if (book == null) {
                throw new ArgumentNullException("book");
            }
            var availableBookSet = GetFirstAvailableBookSet(book);
            if (availableBookSet == null) {
                availableBookSet = new BookSet();
                _bookSets.Add(availableBookSet);
            }
            availableBookSet.AddBook(book);
        }

        private BookSet GetFirstAvailableBookSet(Book book)
        {
            if (book == null) {
                throw new ArgumentNullException("book");
            }
            return _bookSets.FirstOrDefault(bookSet => bookSet.Contains(book) == false);
        }
```

Le code est propre et tous les BDD sont implémentés.

L’exercice est terminé.

## Conclusion

Ce court exercice a pour but de présenter l’utilisation du « *Behavior Driven Developpement* » sur un exemple concret : le Kata Potter. J’espère vous avoir fait constaté sa puissance notamment grâce à :

-   l’écriture de **scénarios très clair, exprimant le besoin métier**
-   l’implémentation du code de l’application via **des tests générés automatiquement et orchestrés** par Specflow

Cette  méthode permet de piloter le développement d’une application par le comportement qu’elle doit avoir. Les scénarios permettent de définir précisément ce comportement attendu avec des exemples afin de guider l’implémentation. Ces scénarios sont composés des mots clés « *Given* », « *When* », « *Then* » permettant d’écrire des propositions claires et concises. Le maître mot : la **réutilisabilité** : chaque proposition peut être réutilisée dans d’autres scénarios et même dans d’autres fichiers « *Steps* ».

Récapitulatif des étapes :

1.  Commencer par écrire votre scénario
2.  Générer une à une les différentes phrases (propositions) du scénario dans le fichier « *Steps* » et tout en les implémentant au fur et à mesure.
3.  Créer vos objets avec des valeurs par défaut et ne vous concentrez sur le code métier qu’une fois le test rouge.
4.  Faites tout d’abord une ***lazy implémentation*** des objets testés (objets du domaine) puis faites du *refactoring* pour améliorer le code, tout en conservant les tests au vert. Le terme clé : « **baby steps** » !
5.  Une fois que le code est propre et fonctionnel, revenez à l’étape 1.

## Dans mon entreprise

Actuellement, j’utilise cette méthodologie tous les jours et j’en perçois l’utilité au quotidien. Nous somme en cycle Agile (Scrumban) et c’est au *Product Owner* d’écrire les scénarios. Ils constituent les **spécifications de l’application**. On évite ainsi l’écriture d’un fichier Word de 500 pages pour décrire l’application entière. On n’écrit les scénarios que pour des fonctionnalités à implémenter dans **le sprint à venir**. Ils en sont les critères d’acceptation et définissent le « *terminé* ».

N’avez-vous jamais imaginé jouer, rejouer et rejouer des scénarios fonctionnels automatiquement ? De vous à moi, c’est génial au quotidien.

De manière générale, les tests unitaires sont essentiels pour créer une application **robuste**. Mais contrairement à d’autres processus, ils permettent aussi de la rendre **très souple**, oserais-je dire … **agile** ?

Le développeur à la possibilité de modifier du code existant avec énormément de sécurité. Stratégie de cache ? Optimisation ? Changement d’héritage ? Re-conception ? Autant de choix pouvant l’amener à recoder une grande quantité de classe. Avec les tests, il le fera sans aucune inquiétude : ils seront là pour le guider et lui indiquer toute régression en temps réel.

En tant que développeur, avez-vous été une seule fois été serein lors de *refactoring* sur du code qui n’est pas de vous, *la veille d’un déploiement* ? Êtes-vous en total confiance lors de la modification des classes fondations de l’application, *2 heures avant une démonstration à un client* ?

Testez votre application et vous le serez.
