*This project has been created as part of the 42 curriculum by mbiagi, lparolis, edraccan, alerusso, mfanelli*

# ft_transcendence

## Description

***ft_transcendence*** is a project that reinterprets traditional chess, expanding its basic logic: each piece has a unique special ability, which can be activated by spending skill points earned by capturing opposing pieces during the game. This introduces an additional level of strategy compared to classical chess, where the player must balance traditional moves with the tactical use of special abilities.

The project is set in a dark fantasy aesthetic, with an original character/piece design that reinforces the game's visual identity.

### Obiettivi

- Offer a renewed and more dynamic chess experience, maintaining familiar ground rules but introducing mechanics that reward tactical aggression and long-term planning.
- Allow real-time multiplayer matches between remote users, with reconnection management.
- Offer a tournament system with brackets, leaderboards, and game history, to give players long-term goals beyond a single game.
- Build a comprehensive infrastructure (secure authentication, user profiles, friendship system, real-time notifications) that makes ChessZ a true gaming platform.
- Apply full-stack development skills, containerized infrastructure management, and structured teamwork to a real-world project.

## Instructions

The following requirements are required to get the project started:
- **Docker** (recent version, compatible with compose v2)
- **Docker Compose** (not the docker-compose version)
- **Git** (to clone the repo locally)
- **Internet connection** (for downloading Docker images on first launch and cloning repo)
- **Make** (recommended, so you don't have to run docker compose commands manually)
- Free port **8000** on the host
- **.env file** (configured from *env.example* file)

**Note:** *Node.js*, *PostgreSQL*, *Redis*, or other locally installed runtimes are not required — everything runs containerized via *Docker Compose*.

Start all containers in the background:
```bash
make
```

Stops all containers:
```bash
make down
```

View running containers:
```bash
docker ps
```

Accessing a container:
```bash
docker exec -it <container_name> sh     # bash is not installed
```

Reading logs from a container:
```bash
docker logs <container_name>
```

## Resources
Le risorse che sono state utilizzate sono state le seguenti:

### Backend
- [Esercizi Javascript](https://github.com/AlbertoOlla/esercizi-di-programmazione-javascript "github.com/AlbertoOlla/esercizi-di-programmazione-javascript")
- [Web Socket](https://www.youtube.com/watch?v=pnj3Jbho5Ck "How WebSocket work")

### Database
- [Prisma ORM docs](https://www.prisma.io/docs/orm "Prisma ORM docs")

### Frontend
- [Vue Components](https://vuejs.org/guide/essentials/component-basics.html#in-dom-template-parsing-caveats "Vue Components")
  - [Vue Component Registration](https://vuejs.org/guide/components/registration.html "Vue Component Registration")
  - [Vue Components Props](https://vuejs.org/guide/components/props.html "Vue Components Props")
  - [Vue Component Slots](https://vuejs.org/guide/components/slots.html "Vue Component Slots")
  - [Vue Components Event](https://vuejs.org/guide/components/events.html "Vue Components Event")
- [Vue v-for](https://it.vuejs.org/api/built-in-directives.html#v-for "Vue v-for")
- [Vue v-bind](https://it.vuejs.org/api/built-in-directives.html#v-bind "Vue v-bind")
- [Vue Style Guide](https://vuejs.org/style-guide/ "Vue Style Guide")
- [Tailwind docs](https://tailwindcss.com/docs/installation/using-vite "Tailwind docs")

### Infrastructure & Deployment
- [HashiCorp Vault docs](https://developer.hashicorp.com/vault/docs/configuration "HashiCorp Vault docs")
- [HashiCorp CoreRule Set](https://owasp.org/www-project-modsecurity-core-rule-set/ "HashiCorp CoreRule Set")
- [Nginx configuration](https://projects.intra.42.fr/projects/inception "42 Project Inception")
- [ModSecurity WAF](https://www.getpagespeed.com/server-setup/nginx/install-modsecurity-nginx-linux "ModSecurity WAF")
- [Docker](https://youtu.be/3c-iBn73dDE?si=GZAfuvLYFyp2kX4Z "Docker from zero")

## Team Information

| Intra   | Roles | Responsabilities |
|-|-|-|
| **mfanelli** | Project Manager + Developer | Coordinates the team, organizes meetings and planning, tracks progress and deadlines, manages risks and blocks; develops assigned features. |
| **mbiagi** | Product Owner + Developer | Defines the product vision, manages the backlog and priorities, validates completed work, serves as a reference for evaluators/peers; develops assigned features. |
| **edraccan** | Technical Lead / Architect + Developer | Defines the technical architecture, chooses the technology stack, ensures code quality and best practices, reviews critical changes, and develops assigned features. |
| **lparolis** | Developer | Implement assigned features, participate in code reviews, test and document your work. |
| **alerusso** | Developer | Implement assigned features, participate in code reviews, test and document your work. |

## Project Management
The team organized the work through an initial phase of *task distribution*, followed by in-person meetings aimed at defining the project, coordinating activities, and *defining the main objectives and priorities*. During development, the group maintained a constant comparison on the progress of work, reviewing and updating tasks and objectives when necessary.

Project management, documentation, and information and goal sharing were centralized within a **Notion** workspace shared, organized, and maintained collaboratively by all team members. This has made it possible to have documentation that is always up-to-date, consistent and easily accessible.

Regarding communication and collaboration, several tools were used. **Slack** was primarily used for file and folder sharing and daily communication, while **GitHub** was used for hosting and project management, thanks to a multi-branch structure that enabled collaborative development and change tracking. Finally, **Discord** has been used primarily for remote collaboration, facilitating coordination of activities between team members in different locations.

## Technical Stack

| Level | Tecnologia | Motivo |
|-|-|-|
| ***Frontend*** | *Vue.js* | Progressive frontend framework based on reusable components, with responsiveness system for automatically updating the UI based on state changes. |
|  | *Tailwind* | Utility-first CSS framework that allows you to stylize components directly in markup using predefined classes, without writing separate custom CSS. |
| ***Backend*** | *Node.js* | V8-based server-side JavaScript runtime, used to run JS code outside the browser (HTTP server, filesystem/OS access, scripting). |
|  | *Express* | Minimal framework for Node.js that simplifies routing, HTTP requests/responses, and middleware management  |
| ***Database*** | *PostgreSQL* | Relational database with SQL syntax, native support for advanced data types like JSONB, arrays, and custom data types, allowing for great database scalability, optimization of complex queries |
| ***Other tecnhologies and libraries*** | *Prisma* | ORM for Node.js, used to interact with the PostgreSQL database via a type-safe client automatically generated from the schema imported from the database (`schema.prisma`). Chosen for security on types under development and regarding SQL Injection, integrated migration management and query readability compared to writing raw SQL, reducing the risk of errors such as malformed queries or type mismatches between code and database. |
|  | *Redis* | In-memory key-value database, used for quick-access temporary data. Chosen to save and manage refresh JWT tokens (logout invalidation), the OTPs for 2FA with automatic expiration (TTL). Use cases where disk persistence is not needed and read/write speed is a priority. |
|  | *HashiCorp Vault* | Tool for centralized and secure secret management (DB credentials, JWT secret, etc.), with encrypted storage and controlled access. |
|  | *JWT* | Stateless authentication that avoids database requests or caches for each request, the information is contained and signed in the token itself. It can be used with any RFC-compliant poiche language and framework. Implemented in combination with refresh token, which when the JWT expires is used to request a new JWT + refresh pair. |
|  | *nginx* | Web server used as the only public entry point to the cpsi stack for other services to remain isolated on the internal Docker network. Routes requests to the appropriate containers (Vite frontend, Express backend, Socket.IO) and handles encrypted communication via TLS protocol. Chosen for its reliability in managing reverse proxies and HTTPS, and for the ability to directly serve static files (e.g. media/avatar) without going through the backend. |
|  | *Vite* |  It has been used to create a fast and responsive workspace for the frontend. Thanks to it we used tools like Tailwind, which need to be compiled, and many others. |
|  | *Vue I18n* |  A Vue plugin which implement a lightweight and simple translation module with dynamic JSON storage. |


## Database Schema

[Schema Database](docs/db_diagram.png)

Il database e composto da 10 tabelle:

<details>
<summary><strong>users</strong> — dati utente e autenticazione</summary>
<br>

| Field | Type | Notes |
|-------|------|------|
| *id_user* | int (PK) | Primary Key |
| *username* | varchar(50) | unique |
| *email* | varchar(100) | unique |
| *password* | varchar(200) | hashed |
| *points* | int | default 500 |
| *title* | varchar(200) | default "Newbie" |
| *mfa* | boolean | 2FA enabled or not |
| *google_id* | varchar | unique, id assigned by Google for OAuth |
| *id_preference* | int (FK) | `preferences` |

**Relations**: N:1 with `preferences`, 1:N with `friendships` (as *id_user1*, *id_user2*, *sender*), 1:N with `notifications` (as *id_user* and *id_sender*), 1:N with `tournament_players` (as *id_user*), 1:N with `tournaments` (as *created_by*), 1:N with `users_matches` (as *id_user*)

</details>

---
Informazioni dei pezzi tra cui nome, abilita e costo del suo utilizzo


- abilities: nome e descrizione delle abilita
- friendships: 
- users
- preferences
- notifications
- tournaments
- matches
- tournament_players
- users_matches



<!-- This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
``` -->
