---
title: 'Le « O » de SOLID : Open/Closed Principle (OCP)'
date: '2013-05-29T19:17:00'
category: Clean code
categories:
  - Clean code
  - Good practices
  - SOLID
cover: /images/blog/open-closed-principle.webp
excerpt: "Au sein de la programmation orientée objet, le principe « Ouvert/Fermé » est le deuxième principe de SOLID, et s’applique aux différents concepts manipulés : Assembly, Class, Method. Selon la définition de\_Bertrand Meyer : « Software entities should be open for extension, but closed for modification » On retrouve dans cette phrase un paradoxe intéressant"
---

Au sein de la programmation orientée objet, le principe « *Ouvert/Fermé* » est le deuxième principe de SOLID, et s’applique aux différents concepts manipulés : Assembly, Class, Method. Selon la définition de *Bertrand Meyer* :

<blockquote class="large">

« Software entities should be open for **extension**, but closed for **modification** »

</blockquote>

On retrouve dans cette phrase un paradoxe intéressant : les entités doivent être « *ouvertes* » pour étendre leur comportement, tout en étant « *fermées* » à la modification. Sous entendu, une entité autorise la modification de son comportement, sans en altérer le code source originel. Comment résoudre ce paradoxe ? Comme l’explique notre cher *B.M*, l’**abstraction est la clé**.

Lorsqu’on souhaite effectuer des modifications sur un code existant pour ajouter de la fonctionnalité, on « *étend* » le concept, en ajoutant du nouveau code, par héritage et polymorphisme. On ne modifie en aucun cas le concept originel pour arriver à notre besoin. Si on le faisait, on risquerait de le rendre :

- **fragile** : remplacer du code déjà *éprouvé* par du nouveau code non *éprouvé* fragilise le concept
- **rigide** : l’ajout de code spécifique rigidifie le concept et peut même ne plus respecter le [SRP](http://pgillon.blogspot.fr/2013/05/le-s-de-solid-single-responsability.html)
- **non prévisible** : des effets de bords importants peuvent apparaître
- **non réutilisable** : on risque de spécialiser le concept et de le rendre moins voir non réutilisable

## Exemple

Soit une classe voiture, « *Car* », qui hérite de la classe véhicule, « *Vehicule* ». Il existe une méthode abstraite « *Drive()* » de la classe « *Vehicule* » à surcharger dans les classes dérivées.

<figure class="align-center">
  <a href="/images/blog/ocp-bad-implementation.webp"><img src="/images/blog/ocp-bad-implementation.webp" alt="" width="206" height="192" /></a>
</figure>

Ci-dessous un exemple d’implémentation, la classe *Vehicule* :

```csharp
public abstract class Vehicule
{
    public abstract void Drive();
}
```

La classe *Car* :

```csharp
public class Car : Vehicule
{
    public enum CarType
    {
        Fuel,
        Gazole,
        Electric
    }

    public CarType Type { get; private set; }
    public int LiquidInReservoir { get; private set; }
    public int Kms { get; private set; }

    public override void Drive()
    {
        if (Type != CarType.Electric) {
            LiquidInReservoir--;
        }
        Kms++;
    }
}
```

Cette implémentation de la classe *Car* ne suit pas le principe Ouvert/Fermé. En effet, si l’on souhaite ajouter un nouveau type de voiture, comme par exemple, le type *Hydrogen*, qui, de la même manière que pour les véhicules électriques, ne consomme pas de carburant liquide, nous sommes obligés de **modifier le code source** de la classe *Car*.

La condition deviendrait :

```csharp
if (Type != CarType.Electric && Type != CarType.Hydrogen) {
    LiquidInReservoir--;
}
```

Si la classe était implémentée au sein d’une librairie externe, nous n’aurions pas eu d’autres choix que de **la recoder entièrement** pour qu’elle corresponde à notre nouveau besoin.

En utilisant l’héritage et le polymorphisme sur le concept de voiture, nous pouvons changer son code afin qu’elle respecte le principe OCP :

<figure class="align-center">
  <a href="/images/blog/ocp-good-implementation.webp"><img src="/images/blog/ocp-good-implementation.webp" alt="" width="315" height="215" /></a>
</figure>

La classe *Car* devient abstraite, et requiert l’implémentation d’une nouvelle méthode *ConsumeEnergy()*. L’énumération *CarType* n’a plus lieu d’exister, et est remplacée par *FuelType*, uniquement pour les voitures à essence, *FuelCar*. Le code suivant illustre une implémentation possible :

La classe de base *Vehicule* :

```csharp
public abstract class Vehicule
{
    public abstract void Drive();
}
```

La classe abstraite *Car* :

```csharp {7,11}
public abstract class Car : Vehicule
{
    public int Kms { get; set; }

    public override void Drive()
    {
        ConsumeEnergy();
        Kms++;
    }

    public abstract void ConsumeEnergy();
}
```

La classe *FuelCar* :

```csharp
public class FuelCar : Car
{
    public enum FuelType
    {
        Fuel,
        Gazole
    }

    public int LiquidInReservoir { get; private set; }
    public FuelType Type { get; private set; }

    public override void ConsumeEnergy()
    {
        LiquidInReservoir--;
    }
}
```

La classe ElectricCar :

```csharp
public class ElectricCar : Car
{
    public int BatteryCapacity { get; private set; }

    public override void ConsumeEnergy()
    {
        BatteryCapacity--;
    }
}
```

Le code pour une voiture à hydrogène serait :

```csharp
public class HydrogenCar : Car
{
    public int HydrogenCapacity { get; private set; }

    public override void ConsumeEnergy()
    {
        HydrogenCapacity--;
    }
}
```

Le principe OCP est bien respecté, l’ajout de nouveaux véhicules, afin d’« *étendre* » le périmètre fonctionnel, ne « *modifie* » pas le code source de la classe de base *Car*.

## Conclusion

Ce principe est très important du point de vue de **la ré-utilisabilité du code**. Il aide le développeur à encapsuler les comportements au sein d’une hiérarchie logique de classe. Les classes de base se voient attribuer un périmètre fonctionnel faible, ce qui facilite leur écriture et garantit leur robustesse. Le code qui les compose devient vite mature, testé, et fiable.

OCP et [SRP](http://pgillon.blogspot.fr/2013/05/le-s-de-solid-single-responsability.html) sont essentiels pour appréhender l’architecture logicielle : ils constituent des fondements solides à responsabilité unique et permettent de faire évoluer très facilement les concepts grâce à l’extension.

Prochain article : L pour ***Liskov Substitution Principle***
