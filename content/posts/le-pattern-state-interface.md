---
title: 'Persister un pur modèle métier : le pattern State-Interface'
date: '2015-11-01'
category: Clean code
categories:
  - Clean code
  - Good practices
cover: /images/blog/jorgen-haland-4y-og-rb-b-i4-unsplash.webp
excerpt: "Dans le précédent article, nous avons vu comment mettre en place un compromis sur la conception objet afin d’obtenir rapidement de la persistance sur des applications dites court terme. Nous allons maintenant aborder un nouveau pattern : le State-Interface\_qui permet la persistance de modèles parfaitement encapsulés, notamment dans le contexte d’applications plus importantes."
---

Dans le [précédent article](http://box5594.temp.domains/~pierregi/persister-un-pur-domain-model-compromis-sur-la-conception-objet/), nous avons vu comment mettre en place un compromis sur la conception objet afin d’obtenir rapidement de la persistance sur des applications dites *court terme*. Nous allons maintenant aborder un nouveau pattern : le *State-Interface* qui permet la persistance de modèles parfaitement encapsulés, notamment dans le contexte d’applications plus importantes.

## Introduction

Cet article technique fait partie de la série qui porte sur la question : « *Comment persister un modèle métier sans devoir simplifier sa conception objet et sans devoir se plier aux conventions des ORMs* ? ». Voici les autres articles :

-   [Introduction](/persister-un-pur-domain-model-pas-si-simple/)
-   [Faire un compromis sur la conception objet](/compromis-sur-la-conception-objet/)
-   **Le pattern State-Interface**
-   [Le pattern State-Snapshot](/le-pattern-state-snapshot/)
-   L’Event Sourcing

## Le pattern *State-Interface*

Ce pattern est composé de 3 concepts :

-   Un ***Domain Model*** : classe qui contient de la logique métier lié à un domaine
-   Un ***Persistent Model*** : classe responsable de la persistance des informations du domaine
-   Une interface *IModelState* représentant les états commun entre *Domain Model* et *Persistent Model,* c’est à dire : **les états du domaine à persister**.

Voici un petit schéma pour résumer les interactions de ces acteurs.

<figure class="align-center">
  <img src="/images/blog/state-interface.webp" alt="" width="494" height="251" />
  <figcaption><strong>Schéma du pattern state-interface</strong></figcaption>
</figure>

Le pattern *State-Interface* se décompose en 4 étapes :

1.  **Déterminer** les données ou états du domaine à persister et en faire une interface *IModelState*
2.  **Implémenter explicitement** l’interface *IModelState* dans le ***Domain Model***
3.  **Implémenter normalement** (implicitement) l’interface *IModelState* dans un ***Persistant Model***
4.  **Implémenter la copie d’information** d’un *IModelState* à un autre *IModelState*

## Adaptons l’exemple

Nous allons faire une nouvelle implémentation de [notre exemple de commande](/persister-un-pur-domain-model-pas-si-simple/) de produits, en utilisant le pattern *State-Interface*. Nous utiliserons EntityFramework comme outil de persistance. Rappel du modèle de données :

<figure class="align-center">
  <img src="/images/blog/schema-order.webp" alt="" width="465" height="408" />
</figure>

### 1\. Déterminer les données à persister

Dans un premier temps, nous devons définir les interfaces qui représentent **les données à persister**. Pour l’objet ***OrderLine***, on peut définir l’interface :

```csharp
public interface IOrderLineStates
{
   Product Product { get; set; }
   int Quantity { get; set; }
   DateTime CreationDate { get; set; }
}
```

Pour l’objet ***Order***, on peut définir l’interface :

```csharp
    public interface IOrderStates<TOrderLine> where TOrderLine : IOrderLineStates
    {
        Guid Id { get; set; }
        OrderStatus OrderStatus { get; set; }
        DateTime? SubmitDate { get; set; }
        double TotalCost { get; set; }
        IEnumerable<TOrderLine> Lines { get; set; }
    }
```

### 2\. Implémenter les interfaces de données dans les modèles métiers

Nous implémentons de manière explicite *IOrderStates* dans la classe *Order*.

```csharp
    public class Order : IOrderStates<OrderLine>
    {
        Guid IOrderStates<OrderLine>.Id
        {
            get { return Id; }
            set { Id = value; }
        }
        OrderStatus IOrderStates<OrderLine>.OrderStatus
        {
            get { return _orderStatus; }
            set { _orderStatus = value; }
        }
        DateTime? IOrderStates<OrderLine>.SubmitDate
        {
            get { return SubmitDate; }
            set { SubmitDate = value; }
        }
        double IOrderStates<OrderLine>.TotalCost
        {
            get { return TotalCost; }
            set { TotalCost = value; }
        }
        IEnumerable<OrderLine> IOrderStates<OrderLine>.Lines
        {
            get { return _lines.ToArray(); }
            set { _lines = value.ToList(); }
        }
        
        // ...
    }
```

De cette manière, nous n’exposons pas au monde extérieur ces états. Un objet métier est toujours sensé être intègre et valide. On modifie donc son état interne via des méthodes.

On implémente l’interface *IOrderLineStates* dans la classe *OrderLine* :

```csharp
    public class OrderLine : IOrderLineStates
    {
        int IOrderLineStates.Quantity
        {
            get { return Quantity; }
            set { Quantity = value; }
        }
        DateTime IOrderLineStates.CreationDate
        {
            get { return _creationDate; }
            set { _creationDate = value; }
        }
        Product IOrderLineStates.Product
        {
            get { return Product; }
            set { Product = value; }
        }
        
        // ...
    }
```

### 3\. Implémenter les interfaces de données dans les modèles persistants

Dans la classe ***OrderPersistantModel*** dédiée à la persistance, nous implémentons *IOrderStates* de manière classique :

```csharp
    public class OrderPersistentModel : IOrderStates<OrderLinePersistentModel>
    {
        public IEnumerable<OrderLinePersistentModel> Lines { get; set; }
        public Guid Id { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public DateTime? SubmitDate { get; set; }
        public double TotalCost { get; set; }
        public List<OrderLinePersistentModel> Lines { get; set; }
    }
```

De même, pour la classe ***OrderLinePersistentModel*** avec l’interface *IOrderLineStates* 

```csharp
    public class OrderLinePersistentModel : IOrderLineStates
    {
        public Product Product { get; set; }
        public int Quantity { get; set; }
        public DateTime CreationDate { get; set; }

        // EF properties
        public Guid OrderId { get; set; }
    }
```

*Remarque*: comme nous utilisons EntityFramework, nous devons ajouter un champs **OrderId** permettant de gérer la relation de la table *OrderLine* vers *Order*.

A ce stade, nous n’avons fait qu’implémenter 2 interfaces dans chacun des deux objets correspondant : *Model* et *PersistentModel*.

Vous suivez ?

### 4\. Implémenter la copie de données

Il est temps d’implémenter notre *repository*, permettant de sauvegarder (persister) un modèle métier :

```csharp {21}
    public class EntityFrameworkOrderRepository : IOrderRepository
    {
        private readonly IOrderMapper _orderMapper;

        public EntityFrameworkOrderRepository(IOrderMapper orderMapper)
        {
            _orderMapper = orderMapper;
        }

        public Order Get(Guid id)
        {
            using (var dataContext = new DataContext()) {
                var persistentModel = dataContext
                    .Set<OrderPersistentModel>()
                    .Include("Lines")
                    .FirstOrDefault(x => x.Id == id);

                if (persistentModel == null) {
                    return null;
                }
                return _orderMapper.ToDomainModel(persistentModel);
            }
        }

        public void Add(Order order)
        {
            var persistentModel = _orderMapper.ToPersistentModel(order);
            using (var dataContext = new DataContext()) {
                dataContext.Set<OrderPersistentModel>().Add(persistentModel);
                dataContext.SaveChanges();
            }
        }
    }
```

Par injection, nous utilisons l’interface ***IOrderMapper***, qui nous permet de convertir un *Order* vers un *OrderPersistentModel* et réciproquement, via les méthodes *ToDomainModel* et *ToPersistentModel.*

Pour implémenter cette interface, plusieurs solutions :

-   [AutoMapper](http://automapper.org/) : petite librairie permettant de faire de la copie d’objets.
-   Copie à la main via une méthode d’extension sur ’interface *IOrderStates* et *IOrderLineStates*

Ce code technique n’est pas très intéressant. Si vous souhaitez en savoir plus, vous pouvez jeter un coup d’œil sur l’exemple complet (Cf fin de l’article). Un très bon [article de blog](http://aurelien.boudoux.fr/2014/09/la-transformation-de-donnees-pierre.html) d’[Aurélien Boudoux](https://twitter.com/AurelienBoudoux) présente une manière de faire grâce à une interface *IMergeableCopy* qui utilise la *reflection* pour trouver les champs d’une interface à copier.

## Critique de cette approche

**Avantages** :

-   La classe métier ***Order*** reste parfaitement encapsulée et intègre. On peut concevoir son métier sans contraintes.
-   Il y a une séparation claire entre le modèle du métier et le modèle de persistance (*Domain model* vs *Persistant model*)
-   Les méta-données requises par les ORM pour permettre la persistance sont ajoutées dans les *Persistent Models* et ne polluent pas nos *Domain Models*.

**Inconvénients** :

-   Une interface est sensée représenter un comportement. L’utiliser pour masquer l’état interne d’un objet n’est pas très propre.
-   Le code d’implémentation implicite n’est pas très lisible dans l’objet métier Order.
-   Une partie de la stratégie repose sur une copie de données d’une interface à une autre, un code technique à peu de valeur ajoutée.

## Conclusion

Ce pattern est particulièrement intéressant car il crée **une nette séparation entre *Domain Models* et *Persistent Models***. Nous masquons ainsi les problématiques de persistance à nos objets métiers. Nous pouvons ainsi tisser un domaine métier complexe, à travers l’interaction de nombreuses classes purement concentrées sur l’expression du besoin.

Cependant, l’*implémentation explicite de l’interface* est un code technique sans valeur ajoutée qui **complexifie la lisibilité de notre domaine**. De plus, si à chaque objet du domaine, nous devons lier un objet de persistance, nous pouvons rapidement obtenir un très grand nombre de classes à gérer.

Tout n’est pas parfait dans ce *pattern*, mais je vous recommande de le tester afin de vous forger votre propre point de vue.

## Le code

Vous pouvez retrouver l’intégralité de l’exemple avec *EntityFramework* et *Dapper* sur [Github à ce lien](https://github.com/pierregillon/DomainModelPersistencePatterns/tree/master/Patterns/StateInterface).

## La suite

Une autre solution intéressante et qui se rapproche beaucoup du pattern *State-Interface*, se nomme le *[State-Snapshot](/le-pattern-state-snapshot/)*. Une différence : plus d’implémentation explicite d’interfaces dans nos classes métiers !
