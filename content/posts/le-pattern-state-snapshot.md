---
title: 'Persister un pur domain model : le pattern State-Snapshot'
date: '2019-06-12'
category: Clean code
categories:
  - Clean code
  - Good practices
cover: /images/blog/flowertstate-snaphot.webp
excerpt: "Dans cet article, nous allons aborder le pattern\_State-Snapshot, un autre pattern séparant DomainModel et PersistentModel."
---

Dans cet article, nous allons aborder le pattern ***State-Snapshot***, un autre pattern séparant *DomainModel* et *PersistentModel*.

Dans le **[précédent article](/persister-un-pur-domain-model-le-pattern-state-interface/)**, nous avons vu le pattern ***State-Interface*** permettant de séparer le *modèle métier*, qui a pour rôle d’exprimer les règles du domaine, et le *modèle de persistance*, qui doit en persister les états. La connexion entre ces deux modèles se fait via une interface, implémentée dans chacun d’eux.

Pour le *State-Snapshot*, plus d’interface, mais un objet d’état.

## Introduction

Cet article technique fait partie de la série qui porte sur la question : « *Comment persister un modèle métier sans devoir simplifier sa conception objet et sans devoir se plier aux conventions des ORMs* ? ». Voici les autres articles :

-   [Introduction](/persister-un-pur-domain-model-pas-si-simple/)
-   [Faire un compromis sur la conception objet](/persister-un-pur-domain-model-compromis-sur-la-conception-objet/)
-   [Le pattern State-Interface](/persister-un-pur-domain-model-le-pattern-state-interface/)
-   **Le pattern State-Snapshot**
-   L’event sourcing

## Le pattern *State-Snapshot*

Ce pattern consiste à prendre un ***snapshot*** ou ***photo*** de l’état interne d’un *modèle métier* et de le persister dans une structure de données*.* Ce pattern est inspiré de l’*event sourcing*.

Voici un schéma décrivant les différentes étapes :

<figure>
  <a href="/images/blog/state-snasphot.webp"><img src="/images/blog/state-snasphot.webp" alt="" width="640" height="390" /></a>
</figure>

**Les étapes de fonctionnement du pattern pour une *écriture* :**

1.  Des actions sont exécutées via des méthodes sur l*‘ objet métier*. L’état interne de l’objet se met à jour. Il n’est pas accessible depuis l’extérieur de l’objet.
2.  Lors de l’appel de la méthode .*TakeSnapShot*(), un objet *snapshot* est créé et retourné, contenant l’ensemble des états de l’objet métier à persister.
3.  L’objet *snapshot* est sauvegardé en base de données

**Les étapes de fonctionnement du pattern pour une *lecture* :**

1.  Un objet *snapshot* est rechargé depuis la base de données
2.  Le *snapshot* est injecté dans une instance de l’objet du métier via la méthode *.LoadSnapshot()*, ce qui restaure son état.

Le principal intérêt de passer par un objet dit *snapshot*, est que comme c’est le *modèle métier* qui le construit, il n’a pas besoin d’exposer ses états internes propres et reste donc parfaitement encapsulé.

## Adaptons l’exemple

Nous allons faire une nouvelle implémentation de [notre exemple de commande](/persister-un-pur-domain-model-pas-si-simple/) de produits, en utilisant le pattern *State-Snapshot*. Nous utiliserons *EntityFramework* comme outil de persistance. Rappel du modèle de données :

<figure class="align-center">
  <img src="/images/blog/schema-order.webp" alt="" width="392" height="344" />
</figure>

### 1\. Définir les objets d’état

Pour chaque objet métier, on définit un objet d’état que l’on souhaite persister en base de données. Pour la classe *Order*, on obtient :

```csharp
    public class OrderState
    {
        public Guid Id { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public DateTime? SubmitDate { get; set; }
        public double TotalCost { get; set; }
        public List<OrderLineState> Lines { get; set; }

        public OrderState()
        {
            Lines = new List<OrderLineState>();
        }
}
```

Pour la classe *OrderLine* :

```csharp
    public class OrderLineState
    {
        public Product Product { get; set; }
        public int Quantity { get; set; }
        public DateTime CreationDate { get; set; }

        // EF properties
        public Guid OrderId { get; set; }
}
```

**Remarque** : en DDD, on n’autorise la persistance que des objets dits agrégat (Aggregate root). Dans notre cas, *OrderLine* peut être considéré comme un sous objet de Order et donc on peut faire implémentation où la classe *OrderLineState* n’existe pas, mais les données sont une sous partie de l’objet *OrderState*. Bref, une fois métier et données séparés, on fait ce qu’on veut.

### 2\. Implémenter .*TakeSnapshot*() dans les objets métiers

Pour créer l’objet *OrderState*, à persister, on implémente l’interface *IStateSnapshotable<OrderState>*, et en particulier la méthode .*TakeSnapshot*(). Ici, j’ai choisi d’implémenter en interface explicite, ce qui n’est pas obligatoire.

```csharp {3}
    public class Order : IOrder, IStateSnapshotable<OrderState>
    {
        OrderState IStateSnapshotable<OrderState>.TakeSnapshot()
        {
            return new OrderState
            {
                Id = Id,
                OrderStatus = _orderStatus,
                SubmitDate = SubmitDate,
                TotalCost = TotalCost,
                Lines = _lines.TakeSnapshot<OrderLine, OrderLineState>(x => x.OrderId = Id).ToList()
            };
        }
}
```

Même chose pour *OrderLine* :

```csharp {3}
    public class OrderLine : IOrderLine, IStateSnapshotable<OrderLineState>
    {
        OrderLineState IStateSnapshotable<OrderLineState>.TakeSnapshot()
        {
            return new OrderLineState
            {
                Product = Product,
                Quantity = Quantity,
                CreationDate = _creationDate
            };
        }
}
```

On génère un objet d’état qui est **indépendant de l’état interne de notre objet métier**, voir même avec des sous-types différents, et qui peut être persister comme bon nous semble dans la couche infrastructure.

### 3\. Implémenter .*LoadSnapshot*() dans les objets métiers

Pour construire un objet métier depuis un objet d’état chargé depuis la base, on implémente *LoadSnapshot*(). Cela permet d’initialiser l’état interne de notre objet métier :

```csharp {3}
    public class Order : IOrder, IStateSnapshotable<OrderState>
    {
        void IStateSnapshotable<OrderState>.LoadSnapshot(OrderState snapshot)
        {
            Id = snapshot.Id;
            _orderStatus = snapshot.OrderStatus;
            SubmitDate = snapshot.SubmitDate;
            TotalCost = snapshot.TotalCost;

            _lines.Clear();
            _lines.LoadFromSnapshot(snapshot.Lines);
        }
}
```

Même chose pour *OrderLine* :

```csharp {3}
    public class OrderLine : IOrderLine, IStateSnapshotable<OrderLineState>
    {
        void IStateSnapshotable<OrderLineState>.LoadSnapshot(OrderLineState snapshot)
        {
            Product = snapshot.Product;
            Quantity = snapshot.Quantity;
            _creationDate = snapshot.CreationDate;
        }
}
```

### 4\. Mise à jour du *Repository*

On implémente maintenant le *repository* de *Order* en utilisant les nouvelles méthodes ajoutées :

```csharp {15,22}
    public class EntityFrameworkOrderRepository : IOrderRepository
    {
        public Order Get(Guid id)
        {
            using (var dataContext = new DataContext()) {
                var orderState = dataContext
                    .Set<OrderState>()
                    .Include("Lines")
                    .FirstOrDefault(x => x.Id == id);

                if (orderState == null) {
                    return null;
                }
                var order = new Order();
                ((IStateSnapshotable<OrderState>) order).LoadSnapshot(orderState);
                return order;
            }
        }

        public void Add(Order order)
        {
            var orderState = ((IStateSnapshotable<OrderState>) order).TakeSnapshot();
            using (var dataContext = new DataContext()) {
                dataContext.Set<OrderState>().Add(orderState);
                dataContext.SaveChanges();
            }
        }
}
```

### 4\. Mapping *EntityFramework* sur les objets *State*

Voici deux classes standards EF pour le gérer le mapping des objets *d’état* :

```csharp
    public class OrderStateMapping : EntityTypeConfiguration<OrderState>
    {
        public OrderStateMapping()
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

```csharp
    public class OrderLineStateMapping : EntityTypeConfiguration<OrderLineState>
    {
        public OrderLineStateMapping()
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

Et Voilà.

## Critique de ce *design*

**Avantages** :

-   La classe métier ***Order*** reste parfaitement encapsulée et intègre. On peut concevoir son métier sans contraintes.
-   Il y a une séparation claire entre le modèle métier et le modèle de persistance (*Domain model* vs *Persistant model*). On peut donc avoir des classes drastiquement différentes.
-   Les méta-données requises par les ORM pour permettre la persistance sont ajoutées dans les *Persistent Models* et ne polluent pas nos *Domain Models*.

**Inconvénients** :

-   Le code d’implémentation implicite ajoute un peu de tuyauterie dans l’objet métier *Order*.
-   On confie à un modèle métier de produire un *snapshot* ou *photo* de son état interne. Est-ce réellement de sa responsabilité ?
-   Le nombre de classe est plus important

## Conclusion

Ce pattern est particulièrement intéressant car il crée **une nette séparation entre *Domain Models* et *Persistent Models***. Nous masquons ainsi les problématiques de persistance à nos objets métiers. Nous pouvons tisser un domaine métier complexe, à travers l’interaction de nombreuses classes purement concentrées sur l’expression du besoin.

Contrairement au *[State-Interface](/persister-un-pur-domain-model-le-pattern-state-interface/)*, l’interface à implémenter représente bien ici **un comportement et non un état** : la capacité à lire et prendre une photo de l’état interne d’un objet métier. (*ISnapshotable*)

## Code

Vous pouvez retrouver l’intégralité de l’exemple avec EntityFramework et Dapper sur [Github à ce lien](https://github.com/pierregillon/DomainModelPersistencePatterns/tree/master/Patterns/StateSnapshot).

## La suite

Pour finir cette série sur le modèle métier vs persistance, il reste la dernière étape où cette fois, on change drastiquement de paradigme : l’**Event Sourcing** !
