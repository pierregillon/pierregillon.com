---
title: 'Persister un pur modèle métier : pas si simple !'
date: '2015-11-01T23:13:00'
category: Clean code
categories:
  - Clean code
  - Good practices
cover: /images/blog/benjamin-lehman-gnyj-ce-pvrs8-unsplash.webp
excerpt: >-
  En programmation orienté objet (POO), nous avons l’habitude de manipuler des
  objets qui représente des instances du monde réel. Nous essayons de les
  concevoir le plus fidèlement possible, afin de résoudre plus facilement les
  problématiques liées au métier dans lequel nous évoluons. Comme un système ne
  s’exécute que pour une durée déterminée, il nous faut
---

En programmation orienté objet (POO), nous avons l’habitude de manipuler des objets qui représente des instances du monde réel. Nous essayons de les concevoir le plus fidèlement possible, afin de résoudre plus facilement les problématiques liées au métier dans lequel nous évoluons.

Comme un système ne s’exécute que pour une durée déterminée, il nous faut persister ces objets métiers dans une structure de données afin de sauvegarder l’état général du système. Ainsi, à n’importe quel moment, nous pouvons restaurer le système dans l’état où nous l’avions laissé.

Avez-vous déjà conçu un modèle parfaitement encapsulé, puis été obligé de le corrompre afin de permettre sa persistance ? Comment éviter d’exposer les états internes de ses objets ?

## Exemple de modèle bien encapsulé

Pour bien comprendre cette problématique, prenons un exemple simple. Nous nous y référerons tout au long de cet article et des prochains. Soit un ensemble de classes permettant de commander des produits. Voici un petit schéma relationnel :  

<figure class="align-center">
  <img src="/images/blog/schema-order.webp" alt="" width="432" height="378" />
</figure>

Une commande (*Order*) est composé de plusieurs lignes (*OrderLine*) qui définie chacune un produit (*Product*) avec une quantité. Un catalogue de prix (*PriceCatalog*) permet de trouver le prix d’un produit.

On peut définir l’objet métier *Order* sous forme d’une interface :

```csharp
    public interface IOrder
    {
        Guid Id { get; }
        double TotalCost { get; }
        DateTime? SubmitDate { get; }

        void AddProduct(Product product, int quantity);
        void RemoveProduct(Product product);
        int GetQuantity(Product product);
        void Submit();
    }
```

Pour simplifier l’exemple en C#, nous considérerons que *Product* est un enum :  

```csharp
    public enum Product
    {
        Tshirt,
        Jacket,
        Computer,
        Shoes
    }
```

Nous considérerons aussi que le catalogue de prix est un simple dictionnaire en mémoire Product/Price. Les prix ne changent pas au cours du temps.

```csharp
    public class PriceCatalog
    {
        private readonly Dictionary<Product, double> _prices = 
            new Dictionary<Product, double>
        {
            {Product.Tshirt, 3.00},
            {Product.Jacket, 200.50},
            {Product.Computer, 688.00},
            {Product.Shoes, 120.20},
        };

        public double GetPrice(Product product)
        {
            double price;
            if (_prices.TryGetValue(product, out price)) {
                return price;
            }
            return 0;
        }
    }
```

## Les règles métiers

Quelques règles métiers sont implémentées :

- L’ajout d’un produit nécessite une quantité valide (> 0)
- L’ajout d’un produit déjà existant incrémente sa quantité
- L’ajout, la suppression d’un produit et la soumission de la commande ne peuvent se faire que si la commande n’a pas déjà été soumise.
- Le montant total est cohérent avec l’ensemble des produits ajoutés à la commande en fonction du catalogue.

Une implémentation de cette commande sans aucune notion de persistance peut se faire de la manière suivante :

```csharp
    public class Order : IOrder
    {
        private readonly PriceCatalog _catalog = new PriceCatalog();
        private readonly List<OrderLine> _lines = new List<OrderLine>();

        private OrderStatus _orderStatus;

        public Guid Id { get; private set; }
        public DateTime? SubmitDate { get; private set; }
        public double TotalCost { get; private set; }

        // ----- Constructor
        public Order()
        {
            Id = Guid.NewGuid();
        }

        // ----- Public methods
        public void AddProduct(Product product, int quantity)
        {
            CheckIfDraft();
            CheckQuantity(quantity);

            var line = _lines.FirstOrDefault(x => x.Product == product);
            if (line == null) {
                _lines.Add(new OrderLine(product, quantity));
            }
            else {
                line.IncreaseQuantity(quantity);
            }

            ReCalculateTotalPrice();
        }
        public void RemoveProduct(Product product)
        {
            CheckIfDraft();

            var line = _lines.FirstOrDefault(x => x.Product == product);
            if (line != null) {
                _lines.Remove(line);
            }

            ReCalculateTotalPrice();
        }
        public int GetQuantity(Product product)
        {
            var line = _lines.FirstOrDefault(x => x.Product == product);
            if (line == null) {
                return 0;
            }
            return line.Quantity;
        }
        public void Submit()
        {
            CheckIfDraft();
            SubmitDate = DateTime.Now;
            _orderStatus = OrderStatus.Submitted;
        }

        // ----- Internal logic
        private void CheckIfDraft()
        {
            if (_orderStatus != OrderStatus.Draft)
                throw new OrderOperationException("The operation is only allowed if the order is in draft state.");
        }
        private void CheckQuantity(int quantity)
        {
            if (quantity < 0) {
                throw new OrderOperationException("Unable to add product with negative quantity.");
            }
            if (quantity == 0) {
                throw new OrderOperationException("Unable to add product with no quantity.");
            }
        }
        private void ReCalculateTotalPrice()
        {
            if (_lines.Count == 0) {
                TotalCost = 0;
            }
            TotalCost = _lines.Sum(x => _catalog.GetPrice(x.Product)*x.Quantity);
        }
    }
```

  Ce que nous pouvons dire de cette implémentation de la classe *Order* :

- Elle encapsule parfaitement ses états internes
- Elle expose des méthodes pour effectuer des actions sur l’objet en tenant compte des règles métiers
- Elle expose des propriétés publiques en lecture seule pour lire certains états.

Maintenant, nous souhaitons persister les instances de cette classe.<br />

## Persistance. Et là … problème …

Que souhaitons-nous persister ?

Probablement les données internes de l’objet *Order* et de ses sous-objets *OrderLine* :

- Id
- OrderStatus
- SubmitDate
- TotalCost
- OrderLines
    - OrderId
    - Product
    - Quantity
    - CreationDate

<blockquote class="large">

» *Et alors, c’est quoi le problème* ? »

</blockquote>

Si nous voulons ajouter un objet *Order* dans une base relationnelle en utilisant un ORM comme par exemple EntityFramework, nous devons déclarer deux classes de *mapping*, une pour *Order* et une pour *OrderLine* :

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

Le problème est que toutes les propriétés des objets *Order* et *OrderLine* ne sont pas forcément accessibles. Par exemple, *OrderStatus* et la collection de *OrderLine* de la classe *Order* sont **des attributs privés**. De même pour *OrderId* et *CreationDate* de la classe *OrderLine.* **Nous ne pouvons donc pas lire les états de l’objet à persister.**

Si nous remplaçons EntityFramework par un autre ORM (micro) comme Dapper, le problème reste le même. Par exemple :

```csharp
    public class DapperOrderRepository : IOrderRepository
    {
        public void Add(Order order)
        {
            using (var connection = new SqlConnection(@"Server=localhost\SQLEXPRESS;database=DomainModelPatterns.Compromise;")) {
                connection.Execute("INSERT INTO [dbo].[Order] (Id, OrderStatus, TotalCost, SubmitDate) " + 
                                   "VALUES (@Id, @OrderStatus, @TotalCost, @SubmitDate)", 
                new {
                    Id = order.Id,
                    OrderStatus = order.OrderStatus,
                    TotalCost = order.TotalCost,
                    SubmitDate = order.SubmitDate
                });

                connection.Execute("INSERT INTO [dbo].[OrderLine] (CreationDate, Product, Quantity, OrderId) " +
                                   "VALUES(@CreationDate, @Product, @Quantity, @OrderId)", 
                    order.Lines.Select(line=> new {
                        CreationDate = line.CreationDate,
                        Product = line.Product,
                        Quantity = line.Quantity,
                        OrderId = line.OrderId
                    }));
            }
        }
    }
```

Cette problématique est la même lors de la récupération des données depuis une structure quelconque : nous voulons injecter ces données lues dans l’objet. Or, même **les propriétés publiques sont en lecture seule**. Et ne parlons pas des champs privés, non visibles.

<blockquote class="large">

» *Bah, tu n’as qu’à mettre ces états en public et puis basta ! »*

</blockquote>

Le problème que nous avons ici n’est pas d’ordre technique, mais plutôt **d’ordre philosophique**. Si nous rendons les états de la classe *Order*, publiques, rien ne garantira que ses consommateurs interagiront avec les méthodes contenant les règles métiers ! L’objet pourrait donc se retrouver dans un état incohérent car modifier directement depuis les propriétés. Est-ce vraiment une bonne solution ?

Les instances des classes *Order* et *OrderLine,* définies plus haut, ne peuvent pas être persister telles quelles. Nous devons apporter des modifications à notre *design* pour permettre la persistance.

## Pistes de réflexion

Cette problématique m’a beaucoup tracassé et j’ai longtemps réfléchi, parcouru de nombreux articles sur le web, expérimenté plusieurs approches … De mes réflexions sont ressorties différentes solutions que j’aborderais dans les prochains articles.

- [Faire un compromis sur la conception objet](/compromis-sur-la-conception-objet/)
- [Le pattern State-Interface](/le-pattern-state-interface/)
- [Le pattern State-Snapshot](/le-pattern-state-snapshot/)
- L’event sourcing

## La suite

Étudions tout d’abord une solution de cours terme, pour des projets à petite échelle avec un domaine métier très simple. [Persister un pur modèle métier grâce à un](/compromis-sur-la-conception-objet/) ***[compromis sur la conception objet](/compromis-sur-la-conception-objet/)***.
