# ITHS 2021 Fullstack projekt

## Byggt med:

### React, Typescript, Express, Node.js, Firebase

Projektet är skapat för kursen Fullstackutveckling på IT-högskolan.
Det är en sida där olika hamstrar tävlar om vilken som är sötast.
Man kan se tidigare matcher och deras resultat samt statistiken för samtliga hamstrar.
Man kan även ta bort matcher och lägga till och ta bort hamstrar.

## Level ups:

- Förhöj användarupplevelsen med animationer.
- Använd React Router
- Klicka på en hamster i galleriet, för att se vilka andra hamstrar den har besegrat i tidigare matcher.
  Backend-route: GET /defeated/:hamsterId
- Förbättra Historik så att den kan visa de 10 senaste matcherna i stället för alla matcher. Du behöver lägga till en timestamp i match-objekten för att kunna sortera matcherna efter tid. Eftersom Firestore inte sparar ordningen.
- Ny sida, Rivalitet: användaren ska välja två hamstrar, och kunna se deras inbördes poängställning. Exempel: Hanna 5 - Herkules 3.
  Backend-route: GET /score/:challenger/:defender
- Ny sida, Fighters and slackers: visa de hamstrar som haft flest respektive minst matcher.
  Backend-route: GET /fewMatches och GET /manyMatches
