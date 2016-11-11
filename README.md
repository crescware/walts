# Walts
Walts is a library for Angular (>= 2.0.0) to provide the Observer pattern using RxJS.

## Motivation
Angular is a full stack, but guidance on the state holding is left to the user.

Walts inspired from [flux](https://facebook.github.io/flux/) architecture and [redux](http://redux.js.org/), it provide the order to your Angular application.

## Why Walts?

In Angular, you can build the application by store values to services and bind to on the screen to reference a service from the component without using the Observer pattern. so‐called MVC. If you prefer a reactive architecture, you can be handled all of the state transition transparently by subscribe the change of service in the component using RxJS. These are thing certainly can be achieved without the use of Walts.

In Waltz, it hides the Observer pattern. It benefits can practice this pattern by aggregate methods in Action and combine Dispatcher and Store if you are not skilled of RxJS. When you are developing an application in one person, do as you wish. however, when you promote a team development Walts will exert a force as an auxiliary library.

Walts has followed the concept of CQRS as an its design pattern. They are guidelines, writing process to Actions and reading process to Store. By this guidelines, it is possible to point out the description place as an objective guideline rather than the subjectivity of the developer In the code review at the time of team development. Walts is not only to provide the Observer pattern, It's result in the objective order to the layers except the View of Angular application.

## Installation

```
npm install walts
```

## Examples

- [examples/flux-chat](https://github.com/crescware/walts/tree/master/examples/flux-chat)
- [TodoMVC](https://github.com/armorik83/comparing-ng2-redux-and-walts/tree/master/examples/walts)
- [Shopping cart](https://github.com/armorik83/walts-flux-comparison)

## License

MIT
