---
title: 'Persister un pur modèle métier : compromis sur la conception objet'
date: '2015-11-01T23:25:00'
category: Clean code
categories:
  - Clean code
  - Good practices
cover: /images/blog/kelly-sikkema-md-adgzy-xcve-unsplash.webp
excerpt: >-
  Comme nous l’avons vu dans l’article précédent, il est compliqué de persister
  un pur modèle métier, qui suit les principes de POO, SOLID, Tell don’t ask.
  Quelles solutions permettent de répondre à ces besoins de bonne conception et
  de persistance ? La première solution simple consiste à faire un compromis sur
  la conception objet.
---

Comme nous l’avons vu dans l’**[article précédent](/persister-un-pur-domain-model-pas-si-simple/)**, il est compliqué de persister un pur modèle métier, qui suit les principes de POO, SOLID, *Tell don’t ask*. Quelles solutions permettent de répondre à ces besoins de bonne conception et de persistance ? La première solution simple consiste à faire un compromis sur la conception objet.

## Introduction

Cet article technique fait partie de la série qui porte sur la question : « *Comment persister un modèle métier sans devoir simplifier sa conception objet et sans devoir se plier aux conventions des ORMs* ? ».

Voici les autres articles :

- [Introduction](/persister-un-pur-domain-model-pas-si-simple/)
- **Faire un compromis sur la conception objet**
- [Le pattern State-Interface](/le-pattern-state-interface/)
- [Le pattern State-Snapshot](/le-pattern-state-snapshot/)
- L’Event Sourcing

## Un compromis

Dans beaucoup de cas, nous souhaitons faire une application simple. Quelques classes, quelques centaines de lignes de code, c’est tout. Il est souvent préférable de faire un compromis sur la conception objet et d’en exposer une partie des états internes afin d’en faciliter la persistance, via un ORM par exemple.

Tant que la complexité du domaine n’est pas importante, ce compromis peut faire gagner beaucoup de temps et reste « contrôlable ».

<figure>
  <img src="/images/blog/domain-persistence-compromise.webp" alt="" width="648" height="324" />
</figure>

## Adaptons l’exemple

Nous allons faire une nouvelle implémentation de notre exemple de commande de produits, en utilisant un compromis sur la conception objet. Nous utiliserons EntityFramework comme outil de persistance.

Faire un compromis est très simple : exposer les états internes de notre Order, via des propriétés publiques accessibles en lecture et écriture (get/set en public). Voilà le résultat :

```csharp {3,4,5,6,7}
    public class Order
    {
        public Guid Id { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public DateTime? SubmitDate { get; set; }
        public double TotalCost { get; set; }
        public List<OrderLine> Lines { get; set; }
        
        // Méthodes métiers ...
    }
```

Je ne reprend pas le code métier qui est exactement identique à la précédente classe *Order*, ([cf article d’introduction](/persister-un-pur-domain-model-pas-si-simple/)). Une fois les propriétés définies, nous pouvons persister la classe *Order* via EntityFramework, en déclarant un simple mapping :

```csharp
    public class OrderMapping : EntityTypeConfiguration<Order>
    {
        public OrderMapping()
        {
            this.ToTable("Order");
            this.HasKey(x => x.Id);
            this.Property(x => x.OrderStatus);
            this.Property(x => x.TotalCost);
            this.Property(x => x.SubmitDate);
            this.HasMany(x => x.Lines).WithRequired().HasForeignKey(x=>x.OrderId);
        }
    }
```

Idem pour la sous-classe *OrderLine* : nous exposons ses états internes, via des propriétés publiques :

```csharp {3,4,5,6}
    public class OrderLine
    {
        public DateTime CreationDate { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
        public Guid OrderId { get; set; }
        
        // ...
    }
```

Avec sa classe de mapping :

```csharp
    public class OrderLineMapping : EntityTypeConfiguration<OrderLine>
    {
        public OrderLineMapping()
        {
            this.ToTable("OrderLine");
            this.HasKey(x => new {x.OrderId, x.Product});
            this.Property(x => x.OrderId);
            this.Property(x => x.Product);
            this.Property(x => x.Quantity);
            this.Property(x => x.CreationDate);
        }
    }
```

Une fois les *mappings* écrits, on peut implémenter un *repository* de la classe *Order* de la manière suivante :

```csharp
    public class EntityFrameworkOrderRepository : IOrderRepository
    {
        public Order Get(Guid id)
        {
            using (var dataContext = new DataContext()) {
                return dataContext
                    .Set<Order>()
                    .Include("Lines")
                    .FirstOrDefault(x => x.Id == id);
            }
        }
        public void Add(Order order)
        {
            using (var dataContext = new DataContext()) {
                dataContext.Set<Order>().Add(order);
                dataContext.SaveChanges();
            }
        }
    }
```

*EntityFramework* fait ensuite le reste, il s’occupe de mapper les propriétés publiques directement dans les colonnes des tables appropriées.

## Critique de cette approche

Cette solution est très simple et fonctionnelle. Nous pouvons désormais persister nos objets du domaine *Order* et *OrderLine*. Mais à quel prix ? Il est important d’en connaître les avantages et les inconvénients.

**Avantages** :

- Simplicité d’implémentation = gain de temps
- Un seul modèle pour la logique métier et la persistance : simplicité, pas de *mapping* vers d’autres modèles

**Inconvénients** :

- Les états internes peuvent désormais être modifié depuis l’extérieur, sans évaluer les règles métiers définies dans les méthodes.
- Notre modèle métier devient un modèle de persistance, couplé à la structure de la table Order.
- Les méta-données requises par les ORM pour permettre la persistance sont ajoutées directement dans les modèles métiers et viennent le complexifier.

## Conclusion

Pour certains puristes, ce compromis est **une fausse solution**. Je considère que cela dépend. De quoi ? Du contexte bien sûr. Quand cette solution est adoptée de ***manière réfléchie***, en toute connaissance de cause, et uniquement sur des projets de taille réduite, elle atteint ses objectifs sans nécessité de complexifier la stratégie de persistance.

Un prototype, un *proof of concept*, un début d’application, nous ne sommes pas obligé de commencer par un design séparant le métier et la persistance. Restons pragmatique. Le plus important est de bien concevoir son application, de la tester, afin d’adapter l’architecture au fur à mesure des nouveaux besoins. Tant que la complexité du domaine n’est pas importante, ce compromis peut faire gagner beaucoup de temps.

Malheureusement, aujourd’hui, cette solution est trop souvent systématisée, sans avoir conscience de ses gros inconvénients. J’ai travaillé avec plusieurs clients ayant conçus de bonnes architectures mais dont la couche métier et d’infrastructure étaient fusionnées. Des centaines de classes métiers se transforment en **modèles anémiques** ([Anemic Domain Model Antipattern](http://www.martinfowler.com/bliki/AnemicDomainModel.html)) et la logique métier se voit alors déportée dans des services ou même dans **des méthodes d’extension** ! Ce résultat est souvent provoqué par la mauvaise utilisation des ORMs, notamment EntityFramework pour le monde .NET.

Pour résumer, le compromis sur la conception objet pour permettre la persistance de modèles métiers, est à utiliser, avec parcimonie ; principalement dans le cadre de petits projets avec un domaine à faible complexité.

## Code

Vous pouvez retrouver l’intégralité de l’exemple avec EntityFramework et Dapper sur [Github à ce lien](https://github.com/pierregillon/DomainModelPersistencePatterns/tree/master/Patterns/Compromise).

## La suite

Fini, les solutions temporaires, place aux solutions de long terme. Le prochain article concernera [le pattern](/le-pattern-state-interface/) *[State-Interface](/le-pattern-state-interface/)* permettant d’extraire et de persister les états internes d’un objet en conservant une bonne encapsulation.
