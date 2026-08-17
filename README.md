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
Lo stack tecnico utilizzato e composto da:


| Level | Tecnologia | Motivo |
|-|-|-|
| Frontend | Vue.js + Tailwind|  |
| Backend | Node.js + Express, Prisma (ORM), Redis, JWT |  |
| Database | Postgresql |  |



This template should help get you started developing with Vue 3 in Vite.

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
```
